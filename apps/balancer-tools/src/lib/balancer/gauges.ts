import { NetworkChainId } from "@bleu-balancer-tools/utils";

import POOLS_WITHOUT_GAUGES from "#/data/pools-without-gauge.json";
import POOLS_WITH_GAUGES from "#/data/voting-gauges.json";

const GAUGE_CACHE: { [address: string]: Gauge } = {};
const POOL_CACHE: { [id: string]: Pool } = {};

class Token {
  logoSrc: string;
  address: string;
  weight: number | null;
  symbol: string;

  constructor(data: (typeof POOLS_WITH_GAUGES)[0]["tokens"][0]) {
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
  BASE: NetworkChainId.BASE,
  AVALANCHE: NetworkChainId.AVALANCHE,
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

    let data;
    data = POOLS_WITH_GAUGES.find(
      (g: { id: string }) => g.id.toLowerCase() === id.toLowerCase(),
    );
    if (data) {
      this.createdAt = data.gauge.addedTimestamp;
      this.gauge = new Gauge(data.gauge.address);
    } else {
      data = POOLS_WITHOUT_GAUGES.find(
        (g: { id: string }) => g.id.toLowerCase() === id.toLowerCase(),
      );
      if (data) {
        this.createdAt = data.addedTimestamp;
        this.gauge = null;
      }
    }

    if (!data) {
      throw new Error(`Pool with ID ${id} not found`);
    }

    this.poolType = data.type;
    this.network =
      UPPER_CASE_TO_NETWORK[data.chain as keyof typeof UPPER_CASE_TO_NETWORK];
    this.id = data.id;
    this.address = data.address;
    this.symbol = data.symbol;
    this.tokens = data.tokens.map(
      (t) => new Token(t as (typeof POOLS_WITH_GAUGES)[0]["tokens"][0]),
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

    const data = POOLS_WITH_GAUGES.find(
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
