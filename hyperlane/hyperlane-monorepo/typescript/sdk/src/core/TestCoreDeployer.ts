import { ethers } from 'ethers';

import {
  LegacyMultisigIsm,
  TestInterchainGasPaymaster__factory,
  TestIsm__factory,
  TestMailbox__factory,
} from '@hyperlane-xyz/core';

import { TestChains } from '../consts/chains';
import { MultiProvider } from '../providers/MultiProvider';
import { testCoreConfig } from '../test/testUtils';
import { ChainMap, ChainName } from '../types';

import { HyperlaneCoreDeployer } from './HyperlaneCoreDeployer';
import { TestCoreApp } from './TestCoreApp';
import { coreFactories } from './contracts';
import { CoreConfig } from './types';

const testCoreFactories = {
  ...coreFactories,
  mailbox: new TestMailbox__factory(),
  testIsm: new TestIsm__factory(),
  interchainGasPaymaster: new TestInterchainGasPaymaster__factory(),
};

export class TestCoreDeployer extends HyperlaneCoreDeployer {
  constructor(
    public readonly multiProvider: MultiProvider,
    configMap?: ChainMap<CoreConfig>,
  ) {
    // Note that the multisig module configs are unused.
    const configs = configMap ?? testCoreConfig(TestChains);

    super(multiProvider, configs, testCoreFactories);
  }

  // deploy a test ISM in place of a multisig ISM
  async deployLegacyMultisigIsm(chain: ChainName): Promise<LegacyMultisigIsm> {
    const testIsm = await this.deployContractFromFactory(
      chain,
      testCoreFactories.testIsm,
      'testIsm',
      [],
    );
    await testIsm.setAccept(true);
    return testIsm as unknown as LegacyMultisigIsm;
  }

  // TestIsm is not ownable, so we skip ownership transfer
  async transferOwnershipOfContracts(): Promise<ethers.ContractReceipt[]> {
    return [];
  }

  async deployApp(): Promise<TestCoreApp> {
    return new TestCoreApp(await this.deploy(), this.multiProvider);
  }
}
