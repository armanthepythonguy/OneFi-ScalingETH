import {
  HyperlaneAddresses,
  HyperlaneContracts,
  HyperlaneFactories,
  buildContracts,
  connectContracts,
  serializeContracts,
} from './contracts';
import { MultiProvider } from './providers/MultiProvider';
import { ChainMap, ChainName } from './types';
import { MultiGeneric } from './utils/MultiGeneric';
import { objMap, pick } from './utils/objects';

export class HyperlaneApp<
  Contracts extends HyperlaneContracts,
> extends MultiGeneric<Contracts> {
  constructor(
    public readonly contractsMap: ChainMap<Contracts>,
    public readonly multiProvider: MultiProvider,
  ) {
    const connectedContractsMap = objMap(contractsMap, (chain, contracts) =>
      connectContracts(contracts, multiProvider.getSignerOrProvider(chain)),
    );
    super(connectedContractsMap);
  }

  static buildContracts<C extends HyperlaneContracts>(
    addresses: ChainMap<HyperlaneAddresses>,
    factories: HyperlaneFactories,
    multiProvider: MultiProvider,
  ): { contracts: ChainMap<C>; intersectionProvider: MultiProvider } {
    const chains = Object.keys(addresses);
    const { intersection, multiProvider: intersectionProvider } =
      multiProvider.intersect(chains, true);

    const intersectionAddresses = pick(addresses, intersection);
    const contracts = buildContracts(
      intersectionAddresses,
      factories,
    ) as ChainMap<C>;
    return { contracts, intersectionProvider };
  }

  getContracts(chain: ChainName): Contracts {
    return this.get(chain);
  }

  getAddresses(chain: ChainName): HyperlaneAddresses {
    return serializeContracts(this.get(chain));
  }
}
