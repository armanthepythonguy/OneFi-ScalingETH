import Safe from '@safe-global/safe-core-sdk';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import SafeServiceClient from '@safe-global/safe-service-client';
import { ethers } from 'ethers';

import { ChainName, MultiProvider, chainMetadata } from '@hyperlane-xyz/sdk';

export function getSafeService(
  chain: ChainName,
  multiProvider: MultiProvider,
): SafeServiceClient {
  const signer = multiProvider.getSigner(chain);
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
  const txServiceUrl = chainMetadata[chain].gnosisSafeTransactionServiceUrl;
  if (!txServiceUrl)
    throw new Error(`must provide tx service url for ${chain}`);
  return new SafeServiceClient({ txServiceUrl, ethAdapter });
}

export function getSafe(
  chain: ChainName,
  multiProvider: MultiProvider,
  safeAddress: string,
): Promise<Safe> {
  const signer = multiProvider.getSigner(chain);
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
  return Safe.create({
    ethAdapter,
    safeAddress: safeAddress,
  });
}

export async function getSafeDelegates(
  service: SafeServiceClient,
  safe: string,
) {
  const delegateResponse = await service.getSafeDelegates(safe);
  return delegateResponse.results.map((r) => r.delegate);
}

export async function canProposeSafeTransactions(
  proposer: string,
  chain: ChainName,
  multiProvider: MultiProvider,
  safeAddress: string,
): Promise<boolean> {
  const safeService = getSafeService(chain, multiProvider);
  const safe = await getSafe(chain, multiProvider, safeAddress);
  const delegates = await getSafeDelegates(safeService, safeAddress);
  const owners = await safe.getOwners();
  return delegates.includes(proposer) || owners.includes(proposer);
}
