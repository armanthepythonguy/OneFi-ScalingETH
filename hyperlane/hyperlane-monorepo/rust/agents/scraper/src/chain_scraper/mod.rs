//! This module (and children) are responsible for scraping blockchain data and
//! keeping things updated.

use std::collections::HashMap;
use std::future::Future;
use std::sync::Arc;

use eyre::{eyre, Result};
use futures::TryFutureExt;
use itertools::Itertools;
use tracing::trace;

use hyperlane_base::{chains::IndexSettings, ContractSyncMetrics};
use hyperlane_core::{
    BlockInfo, HyperlaneChain, HyperlaneContract, HyperlaneDomain, HyperlaneMessage,
    HyperlaneProvider, InterchainGasPaymasterIndexer, InterchainGasPayment, LogMeta, Mailbox,
    MailboxIndexer, H256,
};

use crate::db::StorablePayment;
use crate::{
    chain_scraper::sync::Syncer,
    date_time,
    db::{BasicBlock, BlockCursor, ScraperDb, StorableDelivery, StorableMessage, StorableTxn},
};

mod sync;

/// Maximum number of records to query at a time. This came about because when a
/// lot of messages are sent in a short period of time we were ending up with a
/// lot of data to query from the node provider between points when we would
/// actually save it to the database.
const CHUNK_SIZE: usize = 50;

/// Local chain components like the mailbox.
#[derive(Debug, Clone)]
pub struct Contracts {
    pub mailbox: Arc<dyn Mailbox>,
    pub mailbox_indexer: Arc<dyn MailboxIndexer>,
    pub igp_indexer: Arc<dyn InterchainGasPaymasterIndexer>,
    pub provider: Arc<dyn HyperlaneProvider>,
}

/// A chain scraper is comprised of all the information and contract/provider
/// connections needed to scrape the contracts on a single blockchain.
#[derive(Clone, Debug)]
pub struct SqlChainScraper {
    db: ScraperDb,
    /// Contracts on this chain representing this chain (e.g. mailbox)
    contracts: Contracts,
    chunk_size: u32,
    metrics: ContractSyncMetrics,
    cursor: Arc<BlockCursor>,
}

#[allow(unused)]
impl SqlChainScraper {
    pub async fn new(
        db: ScraperDb,
        contracts: Contracts,
        index_settings: &IndexSettings,
        metrics: ContractSyncMetrics,
    ) -> Result<Self> {
        let cursor = Arc::new(
            db.block_cursor(
                contracts.mailbox.domain().id(),
                index_settings.from() as u64,
            )
            .await?,
        );
        Ok(Self {
            db,
            contracts,
            chunk_size: index_settings.chunk_size(),
            metrics,
            cursor,
        })
    }

    pub fn domain(&self) -> &HyperlaneDomain {
        self.contracts.mailbox.domain()
    }

    /// Sync contract data and other blockchain with the current chain state.
    /// This will create a long-running task that should be spawned.
    pub fn sync(self) -> impl Future<Output = Result<()>> + Send + 'static {
        let chain = self.contracts.mailbox.domain().name().to_owned();
        Syncer::new(self)
            .and_then(|syncer| syncer.run())
            .and_then(|()| async move { panic!("Sync task for {chain} stopped!") })
    }

    /// Fetch the highest message nonce we have seen for the local domain.
    async fn last_message_nonce(&self) -> Result<Option<u32>> {
        self.db
            .last_message_nonce(self.domain().id(), &self.contracts.mailbox.address())
            .await
    }

    /// Store messages from the origin mailbox into the database.
    ///
    /// Returns the highest message nonce which was provided to this
    /// function.
    async fn store_messages(
        &self,
        messages: &[HyperlaneMessageWithMeta],
        txns: &HashMap<H256, TxnWithId>,
    ) -> Result<u32> {
        debug_assert!(!messages.is_empty());

        let max_nonce = messages
            .iter()
            .map(|m| m.message.nonce)
            .max()
            .ok_or_else(|| eyre!("Received empty list"))?;
        self.db
            .store_messages(
                &self.contracts.mailbox.address(),
                messages.iter().map(|m| {
                    let txn = txns.get(&m.meta.transaction_hash).unwrap();
                    StorableMessage {
                        msg: m.message.clone(),
                        meta: &m.meta,
                        txn_id: txn.id,
                    }
                }),
            )
            .await?;

        Ok(max_nonce)
    }

    /// Record that a message was delivered.
    async fn store_deliveries(
        &self,
        deliveries: &[Delivery],
        txns: &HashMap<H256, TxnWithId>,
    ) -> Result<()> {
        if deliveries.is_empty() {
            return Ok(());
        }

        let storable = deliveries.iter().map(|delivery| {
            let txn_id = txns.get(&delivery.meta.transaction_hash).unwrap().id;
            delivery.as_storable(txn_id)
        });

        self.db
            .store_deliveries(
                self.domain().id(),
                self.contracts.mailbox.address(),
                storable,
            )
            .await
    }

    async fn store_payments(
        &self,
        payments: &[Payment],
        txns: &HashMap<H256, TxnWithId>,
    ) -> Result<()> {
        if payments.is_empty() {
            return Ok(());
        }

        let storable = payments.iter().map(|payment| {
            let txn_id = txns.get(&payment.meta.transaction_hash).unwrap().id;
            payment.as_storable(txn_id)
        });

        self.db.store_payments(self.domain().id(), storable).await
    }

    /// Takes a list of txn and block hashes and ensure they are all in the
    /// database. If any are not it will fetch the data and insert them.
    ///
    /// Returns the relevant transaction info.
    async fn ensure_blocks_and_txns(
        &self,
        message_metadata: impl Iterator<Item = &LogMeta>,
    ) -> Result<impl Iterator<Item = TxnWithId>> {
        let block_hash_by_txn_hash: HashMap<H256, H256> = message_metadata
            .map(|meta| (meta.transaction_hash, meta.block_hash))
            .collect();

        // all blocks we care about
        // hash of block maps to the block id and timestamp
        let blocks: HashMap<_, _> = self
            .ensure_blocks(block_hash_by_txn_hash.values().copied())
            .await?
            .map(|block| (block.hash, block))
            .collect();
        trace!(?blocks, "Ensured blocks");

        // all txns we care about
        let txns_with_ids =
            self.ensure_txns(block_hash_by_txn_hash.into_iter().map(
                move |(txn_hash, block_hash)| {
                    let block_info = *blocks.get(&block_hash).as_ref().unwrap();
                    TxnWithBlockId {
                        txn_hash,
                        block_id: block_info.id,
                    }
                },
            ))
            .await?;

        Ok(txns_with_ids.map(move |TxnWithId { hash, id: txn_id }| TxnWithId { hash, id: txn_id }))
    }

    /// Takes a list of transaction hashes and the block id the transaction is
    /// in. if it is in the database already:
    ///     Fetches its associated database id
    /// if it is not in the database already:
    ///     Looks up its data with ethers and then returns the database id after
    ///     inserting it into the database.
    async fn ensure_txns(
        &self,
        txns: impl Iterator<Item = TxnWithBlockId>,
    ) -> Result<impl Iterator<Item = TxnWithId>> {
        // mapping of txn hash to (txn_id, block_id).
        let mut txns: HashMap<H256, (Option<i64>, i64)> = txns
            .map(|TxnWithBlockId { txn_hash, block_id }| (txn_hash, (None, block_id)))
            .collect();

        let db_txns = if !txns.is_empty() {
            self.db.get_txn_ids(txns.keys()).await?
        } else {
            HashMap::new()
        };
        for (hash, id) in db_txns {
            // insert the txn id now that we have it to the Option value in txns
            let _ = txns
                .get_mut(&hash)
                .expect("We found a txn that we did not request")
                .0
                .insert(id);
        }

        // insert any txns that were not known and get their IDs
        // use this vec as temporary list of mut refs so we can update once we get back
        // the ids.
        let mut txns_to_fetch = txns.iter_mut().filter(|(_, id)| id.0.is_none());

        let mut txns_to_insert: Vec<StorableTxn> = Vec::with_capacity(CHUNK_SIZE);
        for mut chunk in as_chunks::<(&H256, &mut (Option<i64>, i64))>(txns_to_fetch, CHUNK_SIZE) {
            for (hash, (_, block_id)) in chunk.iter() {
                let info = self.contracts.provider.get_txn_by_hash(hash).await?;
                txns_to_insert.push(StorableTxn {
                    info,
                    block_id: *block_id,
                });
            }

            let mut cur_id = self.db.store_txns(txns_to_insert.drain(..)).await?;
            for (_hash, (txn_id, _block_id)) in chunk.iter_mut() {
                debug_assert!(cur_id > 0);
                let _ = txn_id.insert(cur_id);
                cur_id += 1;
            }
        }

        Ok(txns
            .into_iter()
            .map(|(hash, (txn_id, _block_id))| TxnWithId {
                hash,
                id: txn_id.unwrap(),
            }))
    }

    /// Takes a list of block hashes for each block
    /// if it is in the database already:
    ///     Fetches its associated database id
    /// if it is not in the database already:
    ///     Looks up its data with ethers and then returns the database id after
    ///     inserting it into the database.
    async fn ensure_blocks(
        &self,
        block_hashes: impl Iterator<Item = H256>,
    ) -> Result<impl Iterator<Item = BasicBlock>> {
        // mapping of block hash to the database id and block timestamp. Optionals are
        // in place because we will find the timestamp first if the block was not
        // already in the db.
        let mut blocks: HashMap<H256, Option<BasicBlock>> =
            block_hashes.map(|b| (b, None)).collect();

        let db_blocks: Vec<BasicBlock> = if !blocks.is_empty() {
            // check database to see which blocks we already know and fetch their IDs
            self.db.get_block_basic(blocks.keys()).await?
        } else {
            vec![]
        };

        for block in db_blocks {
            let _ = blocks
                .get_mut(&block.hash)
                .expect("We found a block that we did not request")
                .insert(block);
        }

        // insert any blocks that were not known and get their IDs
        // use this vec as temporary list of mut refs so we can update their ids once we
        // have inserted them into the database.
        // Block info is an option so we can move it, must always be Some before
        // inserted into db.
        let blocks_to_fetch = blocks
            .iter_mut()
            .filter(|(_, block_info)| block_info.is_none());

        let mut blocks_to_insert: Vec<(&mut BasicBlock, Option<BlockInfo>)> =
            Vec::with_capacity(CHUNK_SIZE);
        for chunk in as_chunks(blocks_to_fetch, CHUNK_SIZE) {
            debug_assert!(!chunk.is_empty());
            for (hash, block_info) in chunk {
                let info = self.contracts.provider.get_block_by_hash(hash).await?;
                let basic_info_ref = block_info.insert(BasicBlock {
                    id: -1,
                    hash: *hash,
                    timestamp: date_time::from_unix_timestamp_s(info.timestamp),
                });
                blocks_to_insert.push((basic_info_ref, Some(info)));
            }

            let mut cur_id = self
                .db
                .store_blocks(
                    self.domain().id(),
                    blocks_to_insert
                        .iter_mut()
                        .map(|(_, info)| info.take().unwrap()),
                )
                .await?;

            for (block_ref, _) in blocks_to_insert.drain(..) {
                block_ref.id = cur_id;
                cur_id += 1;
            }
        }

        // ensure we have updated all the block ids and that we have info for all of
        // them.
        #[cfg(debug_assertions)]
        for (hash, block) in blocks.iter() {
            let block = block.as_ref().unwrap();
            assert_eq!(hash, &block.hash);
            assert!(block.id > 0);
        }

        Ok(blocks
            .into_iter()
            .map(|(hash, block_info)| block_info.unwrap()))
    }
}

#[derive(Debug, Clone)]
struct Delivery {
    message_id: H256,
    meta: LogMeta,
}

impl Delivery {
    fn as_storable(&self, txn_id: i64) -> StorableDelivery {
        StorableDelivery {
            message_id: self.message_id,
            meta: &self.meta,
            txn_id,
        }
    }
}

#[derive(Debug, Clone)]
struct Payment {
    payment: InterchainGasPayment,
    meta: LogMeta,
}

impl Payment {
    fn as_storable(&self, txn_id: i64) -> StorablePayment {
        StorablePayment {
            payment: &self.payment,
            meta: &self.meta,
            txn_id,
        }
    }
}

#[derive(Debug, Clone)]
struct TxnWithId {
    hash: H256,
    id: i64,
}

#[derive(Debug, Clone)]
struct TxnWithBlockId {
    txn_hash: H256,
    block_id: i64,
}

#[derive(Debug, Clone)]
struct HyperlaneMessageWithMeta {
    message: HyperlaneMessage,
    meta: LogMeta,
}

fn as_chunks<T>(iter: impl Iterator<Item = T>, chunk_size: usize) -> impl Iterator<Item = Vec<T>> {
    // the itertools chunks function uses refcell which cannot be used across an
    // await so this stabilizes the result by putting it into a vec of vecs and
    // using that for iteration.
    iter.chunks(chunk_size)
        .into_iter()
        .map(|chunk| chunk.into_iter().collect())
        .collect_vec()
        .into_iter()
}
