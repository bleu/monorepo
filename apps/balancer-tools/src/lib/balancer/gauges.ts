import GAUGE_DATA from "#/data/voting-gauges.json";

type TokenLogoURIs = { [key: string]: string | null | undefined };

const GAUGE_CACHE: { [address: string]: Gauge } = {};
const POOL_CACHE: { [id: string]: Pool } = {};

class Token {
  address: string;
  weight: string | null;
  symbol: string;

  constructor(data: (typeof GAUGE_DATA)[0]["pool"]["tokens"][0]) {
    this.address = data.address;
    this.weight = data.weight;
    this.symbol = data.symbol;
  }
}

export class Pool {
  id!: string;
  address!: string;
  poolType!: string;
  symbol!: string;
  tokens!: Token[];
  gauge?: Gauge;

  constructor(id: string, associatedGauge?: Gauge) {
    // Return cached instance if it exists
    if (POOL_CACHE[id]) {
      return POOL_CACHE[id];
    }

    const data = GAUGE_DATA.find((g) => g.pool.id === id)?.pool;
    if (!data) {
      throw new Error(`Pool with ID ${id} not found`);
    }

    this.id = data.id;
    this.address = data.address;
    this.poolType = data.poolType;
    this.symbol = data.symbol;
    this.tokens = data.tokens.map(
      (t: (typeof GAUGE_DATA)[0]["pool"]["tokens"][0]) => new Token(t),
    );
    this.gauge = associatedGauge;

    if (!this.gauge) {
      const gaugeData = GAUGE_DATA.find((g) => g.pool.id === this.id);
      if (gaugeData) {
        this.gauge = new Gauge(gaugeData.address);
        this.gauge.pool = this;
      }
    }

    POOL_CACHE[this.id] = this;
  }
}

export class Gauge {
  address!: string;
  network!: number;
  isKilled?: boolean;
  addedTimestamp!: number;
  relativeWeightCap!: string | null;
  pool!: Pool;
  tokenLogoURIs?: TokenLogoURIs;

  constructor(address: string) {
    // Return cached instance if it exists
    if (GAUGE_CACHE[address]) {
      return GAUGE_CACHE[address];
    }

    const data = GAUGE_DATA.find(
      (g) => g.address.toLowerCase() === address.toLowerCase(),
    );
    if (!data) {
      throw new Error("Gauge not found for the provided address.");
    }
    this.address = data.address;
    this.network = data.network;
    this.isKilled = data.isKilled;
    this.addedTimestamp = data.addedTimestamp;
    this.relativeWeightCap = data.relativeWeightCap;
    this.pool = data.pool;
    this.tokenLogoURIs = data.tokenLogoURIs;

    GAUGE_CACHE[this.address] = this;
  }
}
