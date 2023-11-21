import { networkIdFor } from "@bleu-fi/utils";
import { eq } from "drizzle-orm";

import POOLS_WITH_GAUGES from "#/data/voting-gauges.json";
import { db } from "#/db";
import { pools, poolTokens, tokens } from "#/db/schema";

const GAUGE_CACHE: { [address: string]: Gauge } = {};
const POOL_CACHE: { [id: string]: Pool } = {};

interface TokenData {
  poolExternalId: string | null;
  address: string | null;
  weight: string | null;
  symbol: string | null;
}
class Token {
  poolExternalId: string | null;
  address: string | null;
  weight: number | null;
  symbol: string | null;

  constructor(data: TokenData) {
    this.poolExternalId = data.poolExternalId;
    this.address = data.address;
    this.weight = Number(data.weight);
    this.symbol = data.symbol;
  }
}

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

    this.initialize(id);
  }

  async initialize(id: string): Promise<void> {
    const poolDataList = await db
      .select({
        poolExternalId: pools.externalId,
        address: pools.address,
        network: pools.networkSlug,
        type: pools.poolType,
        symbol: pools.symbol,
      })
      .from(pools)
      .where(eq(pools.externalId, id));

    if (!poolDataList) {
      throw new Error(`Pool with ID ${id} not found in the database`);
    }

    const poolData = poolDataList[0];

    const poolsTokens = await db
      .select({
        poolExternalId: poolTokens.poolExternalId,
        address: poolTokens.tokenAddress,
        weight: poolTokens.weight,
        symbol: tokens.symbol,
      })
      .from(poolTokens)
      .leftJoin(tokens, eq(tokens.address, poolTokens.tokenAddress))
      .where(eq(poolTokens.poolExternalId, id));

    this.poolType = poolData.type ?? "";
    this.network = Number(networkIdFor(poolData.network ?? undefined));
    this.id = poolData.poolExternalId ?? "";
    this.address = poolData.address ?? "";
    this.symbol = poolData.symbol ?? "";
    this.tokens = poolsTokens.map((t) => new Token(t));
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
