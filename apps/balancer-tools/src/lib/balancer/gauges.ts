import { NetworkChainId } from "@bleu-balancer-tools/utils";

import ARBITRUM_POOLS from "#/data/pools-arbitrum.json";
import AVALANCHE_POOLS from "#/data/pools-avalanche.json";
import BASE_POOLS from "#/data/pools-base.json";
import ETHEREUM_POOLS from "#/data/pools-ethereum.json";
import GNOSIS_POOLS from "#/data/pools-gnosis.json";
import OPTIMISM_POOLS from "#/data/pools-optimism.json";
import POLYGON_POOLS from "#/data/pools-polygon.json";
import POLYGONZKEVM_POOLS from "#/data/pools-polygonzkevm.json";
import POOLS_WITH_GAUGES from "#/data/voting-gauges.json";

interface PoolToken {
  address: string;
  symbol: string;
  weight: string | null;
  logoURI?: string;
}

interface PoolWithoutGauge {
  id: string;
  address: string;
  symbol: string;
  poolType: string;
  createTime: number;
  tokens: PoolToken[];
}

interface PoolWithGauge {
  chain: string;
  id: string;
  address: string;
  symbol: string;
  type: string;
  gauge: Gauge;
  tokens: [];
}
const GAUGE_CACHE: { [address: string]: Gauge } = {};
const POOL_CACHE: { [id: string]: Pool } = {};

class Token {
  logoSrc?: string;
  address: string;
  weight: number | null;
  symbol: string;

  constructor(data: PoolToken) {
    this.logoSrc = data.logoURI;
    this.address = data.address;
    this.weight = Number(data.weight);
    this.symbol = data.symbol;
  }
}

const UPPER_CASE_TO_NETWORK = {
  MAINNET: NetworkChainId.ETHEREUM,
  POLYGON: NetworkChainId.POLYGON,
  ZKEVM: NetworkChainId.POLYGONZKEVM,
  OPTIMISM: NetworkChainId.OPTIMISM,
  GNOSIS: NetworkChainId.GNOSIS,
  ARBITRUM: NetworkChainId.ARBITRUM,
} as const;

export class Pool {
  id!: string;
  address!: string;
  network!: number;
  poolType!: string;
  symbol!: string;
  tokens!: Token[];
  gauge?: Gauge | null;
  createdAt!: number;

  constructor(id: string) {
    if (POOL_CACHE[id]) {
      return POOL_CACHE[id];
    }

    const commonNetworkConfig = {
      createdAt: (data: PoolWithoutGauge) => data.createTime,
      poolType: (data: PoolWithoutGauge) => data.poolType,
      gauge: (_: PoolWithoutGauge) => null,
    };

    const networks = [
      {
        pools: POOLS_WITH_LIVE_GAUGES,
        networkId: (data: PoolWithGauge) =>
          UPPER_CASE_TO_NETWORK[
            data.chain as keyof typeof UPPER_CASE_TO_NETWORK
          ],
        createdAt: (data: PoolWithGauge) => data.gauge.address,
        poolType: (data: PoolWithGauge) => data.type,
        gauge: (data: PoolWithGauge) => new Gauge(data.gauge.address),
      },
      {
        pools: ETHEREUM_POOLS,
        networkId: (_: PoolWithoutGauge) => 1,
        ...commonNetworkConfig,
      },
      {
        pools: POLYGON_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.POLYGON,
        ...commonNetworkConfig,
      },
      {
        pools: POLYGONZKEVM_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.POLYGONZKEVM,
        ...commonNetworkConfig,
      },
      {
        pools: ARBITRUM_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.ARBITRUM,
        ...commonNetworkConfig,
      },
      {
        pools: GNOSIS_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.GNOSIS,
        ...commonNetworkConfig,
      },
      {
        pools: OPTIMISM_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.OPTIMISM,
        ...commonNetworkConfig,
      },
      {
        pools: BASE_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.BASE,
        ...commonNetworkConfig,
      },
      {
        pools: AVALANCHE_POOLS,
        networkId: (_: PoolWithoutGauge) => NetworkChainId.AVAX,
        ...commonNetworkConfig,
      },
    ];

    let data;
    for (const network of networks) {
      data = network.pools.find(
        (g: { id: string }) => g.id.toLowerCase() === id.toLowerCase(),
      );
      if (data) {
        this.poolType = network.poolType(
          // @ts-ignore: 2345
          data as PoolWithGauge | PoolWithoutGauge,
        );
        this.network = network.networkId(
          // @ts-ignore: 2345
          data as PoolWithGauge | PoolWithoutGauge,
        );
        this.createdAt = parseFloat(
          // @ts-ignore: 2345
          String(network.createdAt(data as PoolWithGauge | PoolWithoutGauge)),
        );
        // @ts-ignore: 2345
        this.gauge = network.gauge(data as PoolWithGauge | PoolWithoutGauge);
        break;
      }
    }

    if (!data) {
      throw new Error(`Pool with ID ${id} not found`);
    }

    this.id = data.id;
    this.address = data.address;
    this.symbol = data.symbol;
    this.tokens = data.tokens.map((t: PoolToken) => new Token(t));
    POOL_CACHE[this.id] = this;
  }
}

export class Gauge {
  address!: string;
  isKilled?: boolean;
  relativeWeightCap!: string | null;

  constructor(address: string) {
    // Return cached instance if it exists
    if (GAUGE_CACHE[address]) {
      return GAUGE_CACHE[address];
    }

    const data = POOLS_WITH_LIVE_GAUGES.find(
      (g) => g.gauge.address.toLowerCase() === address.toLowerCase(),
    );

    if (!data) {
      throw new Error("Gauge not found for the provided address.");
    }
    if (data.gauge.addedTimestamp === null) {
      throw new Error("AddedTimestamp is null for the provided address.");
    }
    this.address = data.gauge.address;
    this.isKilled = data.gauge.isKilled;
    this.relativeWeightCap = data.gauge.relativeWeightCap;
    GAUGE_CACHE[this.address] = this;
  }
}
