import { ethers } from 'ethers';

import {
  InterchainGasPaymaster,
  OverheadIgp,
  ProxyAdmin,
  StorageGasOracle,
} from '@hyperlane-xyz/core';
import {
  ChainMap,
  ChainName,
  HyperlaneIgpDeployer,
  MultiProvider,
  OverheadIgpConfig,
  ProxiedContract,
  TransparentProxyAddresses,
} from '@hyperlane-xyz/sdk';
import { types } from '@hyperlane-xyz/utils';

import { DeployEnvironment } from '../config';

export class HyperlaneIgpInfraDeployer extends HyperlaneIgpDeployer {
  environment: DeployEnvironment;

  constructor(
    multiProvider: MultiProvider,
    configMap: ChainMap<OverheadIgpConfig>,
    environment: DeployEnvironment,
  ) {
    super(multiProvider, configMap);
    this.environment = environment;
  }

  async deployInterchainGasPaymaster(
    chain: ChainName,
    proxyAdmin: ProxyAdmin,
    storageGasOracle: StorageGasOracle,
  ): Promise<
    ProxiedContract<InterchainGasPaymaster, TransparentProxyAddresses>
  > {
    const deployOpts = {
      create2Salt: ethers.utils.solidityKeccak256(
        ['string', 'string', 'uint8'],
        [this.environment, 'interchainGasPaymaster', 6],
      ),
    };
    return super.deployInterchainGasPaymaster(
      chain,
      proxyAdmin,
      storageGasOracle,
      deployOpts,
    );
  }

  async deployOverheadInterchainGasPaymaster(
    chain: ChainName,
    interchainGasPaymasterAddress: types.Address,
  ): Promise<OverheadIgp> {
    const deployOpts = {
      create2Salt: ethers.utils.solidityKeccak256(
        ['string', 'string', 'uint8'],
        [this.environment, 'defaultIsmInterchainGasPaymaster', 4],
      ),
    };
    return super.deployOverheadInterchainGasPaymaster(
      chain,
      interchainGasPaymasterAddress,
      deployOpts,
    );
  }
}
