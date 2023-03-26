//! Settings and configuration for Hyperlane agents
//!
//! ## Introduction
//!
//! Hyperlane Agents have a shared core, which contains connection info for rpc,
//! relevant contract addresses on each chain, etc. In addition, each agent has
//! agent-specific settings. By convention above, we represent these as a base
//! config per-Mailbox contract, and a "partial" config per agent. On bootup,
//! the agent loads the configuration, establishes RPC connections, and monitors
//! each configured chain.
//!
//! All agents share the [`Settings`] struct in this crate, and then define any
//! additional `Settings` in their own crate. By convention this is done in
//! `settings.rs` using the [`decl_settings!`] macro.
//!
//! ### Configuration
//!
//! Agents read settings from the config files and/or env from `config/<env?
//!
//! #### N.B.: Environment variable names correspond 1:1 with cfg file's JSON object hierarchy.
//!
//! In particular, note that any environment variables whose names are prefixed
//! with:
//!
//! * `HYP_BASE`
//!
//! * `HYP_[agentname]`, where `[agentmame]` is agent-specific, e.g.
//!   `HYP_VALIDATOR` or `HYP_RELAYER`.
//!
//! will be read as an override to be applied against the hierarchical structure
//! of the configuration provided by the json config file at
//! `./config/<env>/<config>.json`.
//!
//! For example, if the config file `example_config.json` is:
//!
//! ```json
//! {
//!   "environment": "test",
//!   "signers": {},
//!   "chains": {
//!     "test2": {
//!       "domain": "13372",
//!       ...
//!     },
//!     ...
//!   },
//! }
//! ```
//!
//! and an environment variable is supplied which defines
//! `HYP_BASE_CHAINS_TEST2_DOMAIN=1`, then the `decl_settings` macro in
//! `rust/hyperlane-base/src/macros.rs` will directly override the 'domain'
//! field found in the json config to be `1`, since the fields in the
//! environment variable name describe the path traversal to arrive at this
//! field in the JSON config object.
//!
//! ### Configuration value precedence
//!
//! Configuration key/value pairs are loaded in the following order, with later
//! sources taking precedence:
//!
//! 1. The files matching `config/<env>/<config>.json`.
//! 2. The order of configs in `CONFIG_FILES` with each sequential one
//!    overwriting previous ones as appropriate.
//! 3. Configuration env vars with the prefix `HYP_BASE` intended
//!    to be shared by multiple agents in the same environment
//!    E.g. `export HYP_BASE_INBOXES_KOVAN_DOMAIN=3000`
//! 4. Configuration env vars with the prefix `HYP_<agent_prefix>`
//!    intended to be used by a specific agent.
//!    E.g. `export HYP_RELAYER_ORIGINCHAIN="ethereum"`

use std::{collections::HashMap, sync::Arc};

use eyre::{eyre, Context};
use once_cell::sync::OnceCell;
use rusoto_kms::KmsClient;
use serde::Deserialize;

pub use chains::{ChainConnectionConf, ChainSetup, CoreContractAddresses};
use hyperlane_core::utils::StrOrInt;
use hyperlane_core::{
    db::{HyperlaneDB, DB},
    HyperlaneChain, HyperlaneDomain, HyperlaneProvider, InterchainGasPaymaster,
    InterchainGasPaymasterIndexer, Mailbox, MailboxIndexer, MultisigIsm, ValidatorAnnounce, H256,
};
pub use signers::SignerConf;

use crate::{settings::trace::TracingConfig, CachingInterchainGasPaymaster};
use crate::{CachingMailbox, CoreMetrics, HyperlaneAgentCore};

/// Chain configuration
pub mod chains;
pub(crate) mod loader;
/// Signer configuration
mod signers;
/// Tracing subscriber management
pub mod trace;

static KMS_CLIENT: OnceCell<KmsClient> = OnceCell::new();

/// Settings. Usually this should be treated as a base config and used as
/// follows:
///
/// ```
/// use hyperlane_base::*;
/// use serde::Deserialize;
///
/// pub struct OtherSettings { /* anything */ };
///
/// #[derive(Debug, Deserialize)]
/// pub struct MySettings {
///     #[serde(flatten)]
///     base_settings: Settings,
///     #[serde(flatten)]
///     other_settings: (),
/// }
///
/// // Make sure to define MySettings::new()
/// impl MySettings {
///     fn new() -> Self {
///         unimplemented!()
///     }
/// }
/// ```
#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    /// Configuration for contracts on each chain
    pub chains: HashMap<String, ChainSetup>,
    /// Default signer configuration for chains which do not define their own.
    /// This value is intentionally private as it will get consumed by
    /// `post_deserialize`.
    defaultsigner: Option<SignerConf>,
    /// Port to listen for prometheus scrape requests
    pub metrics: Option<StrOrInt>,
    /// The tracing configuration
    pub tracing: TracingConfig,
}

impl Settings {
    /// Generate an agent core
    pub fn build_hyperlane_core(&self, metrics: Arc<CoreMetrics>) -> HyperlaneAgentCore {
        HyperlaneAgentCore {
            metrics,
            settings: self.clone(),
        }
    }
    /// Try to get a map of chain name -> mailbox contract
    pub async fn build_all_mailboxes(
        &self,
        chain_names: &[&str],
        metrics: &CoreMetrics,
        db: DB,
    ) -> eyre::Result<HashMap<HyperlaneDomain, CachingMailbox>> {
        let mut result = HashMap::new();
        for &chain_name in chain_names {
            let mailbox = self
                .build_caching_mailbox(chain_name, db.clone(), metrics)
                .await?;
            result.insert(mailbox.domain().clone(), mailbox);
        }
        Ok(result)
    }

    /// Try to get a map of chain name -> interchain gas paymaster contract
    pub async fn build_all_interchain_gas_paymasters(
        &self,
        chain_names: &[&str],
        metrics: &CoreMetrics,
        db: DB,
    ) -> eyre::Result<HashMap<HyperlaneDomain, CachingInterchainGasPaymaster>> {
        let mut result = HashMap::new();
        for &chain_name in chain_names {
            let igp = self
                .build_caching_interchain_gas_paymaster(chain_name, db.clone(), metrics)
                .await?;
            result.insert(igp.paymaster().domain().clone(), igp);
        }
        Ok(result)
    }

    /// Try to get a CachingMailbox
    async fn build_caching_mailbox(
        &self,
        chain_name: &str,
        db: DB,
        metrics: &CoreMetrics,
    ) -> eyre::Result<CachingMailbox> {
        let mailbox = self
            .build_mailbox(chain_name, metrics)
            .await
            .with_context(|| format!("Building mailbox for {chain_name}"))?;
        let indexer = self
            .build_mailbox_indexer(chain_name, metrics)
            .await
            .with_context(|| format!("Building mailbox indexer for {chain_name}"))?;
        let hyperlane_db = HyperlaneDB::new(chain_name, db);
        Ok(CachingMailbox::new(
            mailbox.into(),
            hyperlane_db,
            indexer.into(),
        ))
    }

    /// Try to get a CachingInterchainGasPaymaster
    async fn build_caching_interchain_gas_paymaster(
        &self,
        chain_name: &str,
        db: DB,
        metrics: &CoreMetrics,
    ) -> eyre::Result<CachingInterchainGasPaymaster> {
        let interchain_gas_paymaster = self
            .build_interchain_gas_paymaster(chain_name, metrics)
            .await?;
        let indexer = self
            .build_interchain_gas_paymaster_indexer(chain_name, metrics)
            .await?;
        let hyperlane_db = HyperlaneDB::new(chain_name, db);
        Ok(CachingInterchainGasPaymaster::new(
            interchain_gas_paymaster.into(),
            hyperlane_db,
            indexer.into(),
        ))
    }

    /// Try to get a MultisigIsm
    pub async fn build_multisig_ism(
        &self,
        chain_name: &str,
        address: H256,
        metrics: &CoreMetrics,
    ) -> eyre::Result<Box<dyn MultisigIsm>> {
        let setup = self
            .chain_setup(chain_name)
            .with_context(|| format!("Building multisig ism for {chain_name}"))?;
        setup.build_multisig_ism(address, metrics).await
    }

    /// Try to get a ValidatorAnnounce
    pub async fn build_validator_announce(
        &self,
        chain_name: &str,
        metrics: &CoreMetrics,
    ) -> eyre::Result<Arc<dyn ValidatorAnnounce>> {
        let setup = self.chain_setup(chain_name)?;
        let announce = setup
            .build_validator_announce(metrics)
            .await
            .with_context(|| format!("Building validator announce for {chain_name}"))?;
        Ok(announce.into())
    }

    /// Try to get the chain setup for the provided chain name
    pub fn chain_setup(&self, chain_name: &str) -> eyre::Result<&ChainSetup> {
        self.chains
            .get(chain_name)
            .ok_or_else(|| eyre!("No chain setup found for {chain_name}"))
    }

    /// Create the core metrics from the settings given the name of the agent.
    pub fn metrics(&self, name: &str) -> eyre::Result<Arc<CoreMetrics>> {
        Ok(Arc::new(CoreMetrics::new(
            name,
            self.metrics
                .as_ref()
                .map(|v| v.try_into().context("Port must be a valid u16"))
                .transpose()?,
            prometheus::Registry::new(),
        )?))
    }

    /// Make internal connections as-needed after deserializing.
    pub(super) fn post_deserialize(&mut self) {
        let Some(signer) = self.defaultsigner.take() else { return };
        for chain in self.chains.values_mut() {
            chain.signer.get_or_insert_with(|| signer.clone());
        }
    }

    /// Private to preserve linearity of AgentCore::from_settings -- creating an
    /// agent consumes the settings.
    fn clone(&self) -> Self {
        Self {
            chains: self.chains.clone(),
            metrics: self.metrics.clone(),
            tracing: self.tracing.clone(),
            defaultsigner: self.defaultsigner.clone(),
        }
    }
}

/// Generate a call to ChainSetup for the given builder
macro_rules! delegate_fn {
    ($name:ident -> $ret:ty) => {
        /// Delegates building to ChainSetup
        pub async fn $name(
            &self,
            chain_name: &str,
            metrics: &CoreMetrics,
        ) -> eyre::Result<Box<$ret>> {
            let setup = self.chain_setup(chain_name)?;
            setup.$name(metrics).await
        }
    };
}

impl Settings {
    delegate_fn!(build_interchain_gas_paymaster -> dyn InterchainGasPaymaster);
    delegate_fn!(build_interchain_gas_paymaster_indexer -> dyn InterchainGasPaymasterIndexer);
    delegate_fn!(build_mailbox -> dyn Mailbox);
    delegate_fn!(build_mailbox_indexer -> dyn MailboxIndexer);
    delegate_fn!(build_provider -> dyn HyperlaneProvider);
}
