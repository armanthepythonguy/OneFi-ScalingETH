import { ChainMap, CoreConfig, objMap } from '@hyperlane-xyz/sdk';

import { multisigIsm } from './multisigIsm';
import { owners } from './owners';

export const core: ChainMap<CoreConfig> = objMap(owners, (local, owner) => {
  return {
    owner,
    multisigIsm: Object.fromEntries(
      Object.entries(multisigIsm).filter(([chain]) => chain !== local),
    ),
  };
});
