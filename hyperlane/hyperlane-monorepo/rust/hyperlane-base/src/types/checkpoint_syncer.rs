use core::str::FromStr;
use std::collections::HashMap;

use ethers::types::Address;
use eyre::{Report, Result};
use prometheus::{IntGauge, IntGaugeVec};

use crate::S3Storage;
use crate::{CheckpointSyncer, LocalStorage, MultisigCheckpointSyncer};

/// Checkpoint Syncer types
#[derive(Debug, Clone, serde::Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum CheckpointSyncerConf {
    /// A local checkpoint syncer
    LocalStorage {
        /// Path
        path: String,
    },
    /// A checkpoint syncer on S3
    S3 {
        /// Bucket name
        bucket: String,
        /// S3 Region
        region: String,
    },
}

/// Error for parsing announced storage locations
#[derive(Debug, PartialEq, Eq)]
pub struct ParseStorageLocationError;

impl FromStr for CheckpointSyncerConf {
    type Err = ParseStorageLocationError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let [prefix, suffix]: [&str; 2] = s
            .split("://")
            .collect::<Vec<_>>()
            .try_into()
            .map_err(|_| ParseStorageLocationError)?;

        match prefix {
            "s3" => {
                let [bucket, region]: [&str; 2] = suffix
                    .split('/')
                    .collect::<Vec<_>>()
                    .try_into()
                    .map_err(|_| ParseStorageLocationError)?;
                Ok(CheckpointSyncerConf::S3 {
                    bucket: bucket.into(),
                    region: region.into(),
                })
            }
            "file" => Ok(CheckpointSyncerConf::LocalStorage {
                path: suffix.into(),
            }),
            _ => Err(ParseStorageLocationError),
        }
    }
}

impl CheckpointSyncerConf {
    /// Turn conf info a Checkpoint Syncer
    pub fn build(
        &self,
        latest_index_gauge: Option<IntGauge>,
    ) -> Result<Box<dyn CheckpointSyncer>, Report> {
        Ok(match self {
            CheckpointSyncerConf::LocalStorage { path } => {
                Box::new(LocalStorage::new(path.clone(), latest_index_gauge))
            }
            CheckpointSyncerConf::S3 { bucket, region } => Box::new(S3Storage::new(
                bucket.clone(),
                region.parse()?,
                latest_index_gauge,
            )),
        })
    }
}

/// Config for a MultisigCheckpointSyncer
#[derive(Debug, Clone, serde::Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub struct MultisigCheckpointSyncerConf {
    /// The checkpoint syncer for each valid validator signer address
    checkpointsyncers: HashMap<String, CheckpointSyncerConf>,
}

impl MultisigCheckpointSyncerConf {
    /// Get a MultisigCheckpointSyncer from the config
    pub fn build(
        &self,
        origin: &str,
        validator_checkpoint_index: IntGaugeVec,
    ) -> Result<MultisigCheckpointSyncer, Report> {
        let mut checkpoint_syncers = HashMap::new();
        for (key, value) in self.checkpointsyncers.iter() {
            let gauge =
                validator_checkpoint_index.with_label_values(&[origin, &key.to_lowercase()]);
            if let Ok(conf) = value.build(Some(gauge)) {
                checkpoint_syncers.insert(Address::from_str(key)?, conf.into());
            } else {
                continue;
            }
        }
        Ok(MultisigCheckpointSyncer::new(checkpoint_syncers))
    }
}
