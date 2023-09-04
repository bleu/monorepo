import { NetworkChainId } from "@bleu-balancer-tools/utils";

import POOLS_WITH_GAUGES from "#/data/voting-gauges.json";

export const POOLS_WITH_LIVE_GAUGES = POOLS_WITH_GAUGES.filter(
  (pool) => !pool.gauge.isKilled && pool.gauge.addedTimestamp,
);

const GAUGE_CACHE: { [address: string]: Gauge } = {};
const POOL_CACHE: { [id: string]: Pool } = {};

class Token {
  logo: string;
  address: string;
  weight: string | null;
  symbol: string;

  constructor(data: (typeof POOLS_WITH_LIVE_GAUGES)[0]["tokens"][0]) {
    this.logo = data.logoURI;
    this.address = data.address;
    this.weight = data.weight;
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
  gauge!: Gauge;

  constructor(id: string, associatedGauge?: Gauge) {
    // Return cached instance if it exists
    if (POOL_CACHE[id]) {
      return POOL_CACHE[id];
    }

    const data = POOLS_WITH_LIVE_GAUGES.find(
      (g) => g.id.toLowerCase() === id.toLowerCase(),
    );

    if (!data) {
      throw new Error(`Pool with ID ${id} not found`);
    }

    this.id = data.id;
    this.address = data.address;
    this.network =
      UPPER_CASE_TO_NETWORK[data.chain as keyof typeof UPPER_CASE_TO_NETWORK];
    this.poolType = data.type;
    this.symbol = data.symbol;
    this.tokens = data.tokens.map(
      (t: (typeof POOLS_WITH_LIVE_GAUGES)[0]["tokens"][0]) => new Token(t),
    );
    this.gauge = associatedGauge || new Gauge(data.gauge.address);

    POOL_CACHE[this.id] = this;
  }
}

export class Gauge {
  address!: string;
  isKilled?: boolean;
  addedTimestamp!: number;
  relativeWeightCap!: string | null;
  pool!: Pool;

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
    this.addedTimestamp = data.gauge.addedTimestamp;
    this.relativeWeightCap = data.gauge.relativeWeightCap;
    this.pool = new Pool(data.id, this);

    GAUGE_CACHE[this.address] = this;
  }
}
