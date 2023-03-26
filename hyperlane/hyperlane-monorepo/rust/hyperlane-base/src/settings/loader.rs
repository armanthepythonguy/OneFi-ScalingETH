use std::collections::HashMap;
use std::env;
use std::error::Error;
use std::path::PathBuf;

use crate::Settings;
use config::{Config, Environment, File};
use eyre::{Context, Result};
use serde::Deserialize;

/// Load a settings object from the config locations.
/// Further documentation can be found in the `settings` module.
pub(crate) fn load_settings_object<'de, T, S>(
    agent_prefix: &str,
    ignore_prefixes: &[S],
) -> Result<T>
where
    T: Deserialize<'de> + AsMut<Settings>,
    S: AsRef<str>,
{
    // Derive additional prefix from agent name
    let prefix = format!("HYP_{}", agent_prefix).to_ascii_uppercase();

    let filtered_env: HashMap<String, String> = env::vars()
        .filter(|(k, _v)| {
            !ignore_prefixes
                .iter()
                .any(|prefix| k.starts_with(prefix.as_ref()))
        })
        .collect();

    let mut base_config_sources = vec![];
    let mut builder = Config::builder();

    // Always load the default config files (`rust/config/*.json`)
    for entry in PathBuf::from("./config")
        .read_dir()
        .expect("Failed to open config directory")
        .map(Result::unwrap)
    {
        if !entry.file_type().unwrap().is_file() {
            continue;
        }

        let fname = entry.file_name();
        let ext = fname.to_str().unwrap().split('.').last().unwrap_or("");
        if ext == "json" {
            base_config_sources.push(format!("{:?}", entry.path()));
            builder = builder.add_source(File::from(entry.path()));
        }
    }

    // Load a set of additional user specified config files
    let config_file_paths: Vec<String> = env::var("CONFIG_FILES")
        .map(|s| s.split(',').map(|s| s.to_string()).collect())
        .unwrap_or_default();

    let builder = config_file_paths.iter().fold(builder, |builder, path| {
        builder.add_source(File::with_name(path))
    });

    let config_deserializer = builder
        // Use a base configuration env variable prefix
        .add_source(
            Environment::with_prefix("HYP_BASE")
                .separator("_")
                .source(Some(filtered_env.clone())),
        )
        .add_source(
            Environment::with_prefix(&prefix)
                .separator("_")
                .source(Some(filtered_env)),
        )
        .build()?;

    let formatted_config = {
        let f = format!("{:#?}", config_deserializer);
        if env::var("ONELINE_BACKTRACES")
            .map(|v| v.to_lowercase())
            .as_deref()
            == Ok("true")
        {
            f.replace('\n', "\\n")
        } else {
            f
        }
    };

    match Config::try_deserialize::<T>(config_deserializer) {
        Ok(mut cfg) => {
            cfg.as_mut().post_deserialize();
            Ok(cfg)
        }
        Err(err) => {
            let err_str = err.to_string();

            let mut err = if let Some(source_err) = err.source() {
                let source = format!("Config error source: {source_err}");
                Err(err).context(source)
            } else {
                Err(err.into())
            };

            for cfg_path in base_config_sources.iter().chain(config_file_paths.iter()) {
                err = err.with_context(|| format!("Config loaded: {cfg_path}"));
            }

            println!(
                "Error during deserialization, showing the config for debugging: {}",
                formatted_config
            );

            match err_str
                .contains("missing field")
                .then(|| err_str.split('`').nth(1))
                .flatten()
            {
                Some("environment") => err = err.context(MISSING_ENV_CTX),
                Some("name") => err = err.context(MISSING_NAME_CTX),
                Some("domain") => err = err.context(MISSING_DOMAIN_CTX),
                Some("addresses") => err = err.context(MISSING_ADDRESSES_CTX),
                Some("mailbox") => err = err.context(MISSING_MAILBOX_CTX),
                Some("interchainGasPaymaster") => err = err.context(MISSING_IGP_CTX),
                Some("validatorAnnounce") => err = err.context(MISSING_VA_CTX),
                Some("protocol") => err = err.context(MISSING_PROTOCOL_CTX),
                Some("finalityBlocks") => err = err.context(MISSING_FINALITY_CTX),
                Some("connection") => err = err.context(MISSING_CONNECTION_CTX),
                Some("type") => err = err.context(MISSING_TYPE_CTX),
                Some("urls") => err = err.context(MISSING_URLS_CTX),
                Some("url") => err = err.context(MISSING_URL_CTX),
                Some("db") => err = err.context(MISSING_DB_CTX),
                Some("v") => err = err.context(MISSING_DESTINATION_CHAIN_NAMES_CTX),
                _ => {}
            }

            err
        }
    }
}

/// Some constant strings that we want to compose. `concat!` requires literals
/// so this provides them.
macro_rules! str_lits {
    (bp) => { "Debugging tips, please ensure: " };
    (env) => { "an env such as `HYP_BASE_CHAINS_ALFAJORES_CONNECTION_TYPE` means the full `chains.alfajores` object must be valid" };
}

const MISSING_ENV_CTX: &str = concat!(
    str_lits!(bp),
    "(1) the `environment` config value is set and spelled correctly",
);

const MISSING_NAME_CTX: &str = concat!(
    str_lits!(bp),
    "(1) the `chains` config value is set and spelled correctly ",
    "(2) a connection URL may have been specified for a chain that is not fully configured, e.g. `HYP_BASE_CHAINS_ALFAJORES_CONNECTION_URL` ",
    "(3) ", str_lits!(env), " ",
    "(4) all chains are correctly named e.g. `chains.alfajores` being misspelled may lead to `chains.alfajores.name` not being found"
);

const MISSING_DOMAIN_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.domain` is specified for all chains as a string-typed integer ",
    "(2) ",
    str_lits!(env)
);

const MISSING_ADDRESSES_CTX: &str = concat!(
    str_lits!(bp),
    "(1) the `chains.<chain_name>.addresses` object is specified for all chains ",
    "(2) ",
    str_lits!(env)
);

const MISSING_MAILBOX_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.addresses.mailbox` is specified for all chains ",
    "(2) ",
    str_lits!(env)
);

const MISSING_IGP_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.addresses.interchainGasPaymaster` is specified for all chains ",
    "(2) ",
    str_lits!(env)
);

const MISSING_VA_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.addresses.validatorAnnounce` is specified for all chains ",
    "(2) ",
    str_lits!(env)
);

const MISSING_PROTOCOL_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.protocol` is specified for all chains, e.g. `ethereum` or `fuel` ",
    "(2) ",
    str_lits!(env)
);

const MISSING_FINALITY_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.finalityBlocks` is specified for all chains ",
    "(2) ",
    str_lits!(env)
);

const MISSING_CONNECTION_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.connection object is specified for all chains ",
    "(2) ",
    str_lits!(env)
);

const MISSING_TYPE_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.connection.type` is specified for all chains, e.g. `http`, `httpFallback`, or `httpQuorum` ",
    "(2) ", str_lits!(env)
);

const MISSING_URLS_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.connection.urls` is specified for the chain ",
    "(2) `urls` is used for connection type that accept multiple like `httpQuorum` and `httpFallback` and `url` is used for connection types that only accept a single url like `http` "
);

const MISSING_URL_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `chains.<chain_name>.connection.url` is specified for the chain ",
    "(2) `url` is used for connection types that only accept a single url like `http` and `urls` is used for connection type that accept multiple like `httpQuorum` and `httpFallback`"
);

const MISSING_DB_CTX: &str = concat!(str_lits!(bp), "(1) `db` config string is specified");

const MISSING_DESTINATION_CHAIN_NAMES_CTX: &str = concat!(
    str_lits!(bp),
    "(1) `destinationchainnames` is specified as a comma separated list of chains the relayer should deliver messages to"
);
