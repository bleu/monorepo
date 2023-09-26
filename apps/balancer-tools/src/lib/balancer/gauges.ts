import { NetworkChainId } from "@bleu-balancer-tools/utils";

import POOLS_WITH_GAUGES from "#/data/voting-gauges.json";
import ETHEREUM_POOLS from "#/data/pools-ethereum.json";
import GOERLI_POOLS from "#/data/pools-goerli.json";

export const POOLS_WITH_LIVE_GAUGES = POOLS_WITH_GAUGES.filter(
  (pool) => !pool.gauge.isKilled && pool.gauge.addedTimestamp,
);

const GAUGE_CACHE: { [address: string]: Gauge } = {};
const POOL_CACHE: { [id: string]: Pool } = {};

class Token {
  logoSrc: string;
  address: string;
  weight: number | null;
  symbol: string;

  constructor(data: (typeof POOLS_WITH_LIVE_GAUGES)[0]["tokens"][0]) {
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
      createdAt: (data) => data.createTime,
      poolType: (data) => data.poolType,
      gauge: (data) => null
    };
    

    const networks = [
      {
        pools: POOLS_WITH_LIVE_GAUGES,
        networkId: (data) => UPPER_CASE_TO_NETWORK[data.chain as keyof typeof UPPER_CASE_TO_NETWORK],
        createdAt: (data) => data.gauge.address,
        poolType: (data) => data.type,
        gauge: (data) => new Gauge(data.gauge.address)
      },
      {
        pools: ETHEREUM_POOLS,
        networkId: (data)=> 1,
        ...commonNetworkConfig
      },
      {
        pools: GOERLI_POOLS,
        networkId: (data)=> 100,
        ...commonNetworkConfig
      },
    ];

    let data;
    for (const network of networks) {
      data = network.pools.find((g) => g.id.toLowerCase() === id.toLowerCase());
      if (data) {
        this.poolType = network.poolType(data);
        this.network = network.networkId(data);
        this.createdAt = network.createdAt(data);
        this.gauge = network.gauge(data);
        break;
      }
    }  

    if (!data) {
      throw new Error(`Pool with ID ${id} not found`);
    }

    this.id = data.id;
    this.address = data.address;
    this.symbol = data.symbol;
    this.tokens = data.tokens.map(
      (t: (typeof POOLS_WITH_LIVE_GAUGES)[0]["tokens"][0]) => new Token(t),
    );
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
