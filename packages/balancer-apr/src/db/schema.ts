import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  decimal,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

const jsonb = customType<{ data: unknown }>({
  dataType() {
    return "jsonb";
  },
  toDriver(val) {
    return val as unknown;
  },
  fromDriver(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value) as unknown;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error parsing JSON", err);
      }
    }
    return value as unknown;
  },
});

export const pools = pgTable(
  "pools",
  {
    id: serial("id").primaryKey(),
    externalId: varchar("external_id").unique(),
    poolType: varchar("pool_type"),
    name: varchar("name"),
    address: varchar("address"),
    totalLiquidity: varchar("total_liquidity"),
    symbol: varchar("symbol"),
    externalCreatedAt: timestamp("external_created_at"),
    poolTypeVersion: decimal("pool_type_version"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.address, t.networkSlug),
  }),
);

export const poolRelations = relations(pools, ({ one, many }) => ({
  tokens: many(poolTokens),
  poolSnapshots: many(poolSnapshots),
  poolSnapshotsTemp: many(poolSnapshotsTemp),
  gauge: one(gauges, {
    fields: [pools.externalId],
    references: [gauges.poolExternalId],
  }),
  vebalAprs: many(vebalApr),
  poolRewards: many(poolRewards),
  swapFeeAprs: many(swapFeeApr),
  rewardsTokenAprs: many(rewardsTokenApr),
  yieldTokenAprs: many(yieldTokenApr),
  poolTokenRateProviders: many(poolTokenRateProviders),
}));

export const blocks = pgTable(
  "blocks",
  {
    id: serial("id").primaryKey(),
    number: integer("number"),
    timestamp: timestamp("timestamp"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    externalId: varchar("external_id").unique(),
  },
  (t) => ({
    unq: unique().on(t.number, t.networkSlug),
  }),
);

export const blockRelations = relations(blocks, ({ many }) => ({
  gaugeSnapshots: many(gaugeSnapshots),
}));

export const tokens = pgTable(
  "tokens",
  {
    id: serial("id").primaryKey(),
    address: varchar("address"),
    symbol: varchar("symbol"),
    name: varchar("name"),
    logoURI: varchar("logo_uri"),
    externalCreatedAt: timestamp("external_created_at"),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.address, t.networkSlug),
  }),
);

export const tokenRelations = relations(tokens, ({ many }) => ({
  tokenPrices: many(tokenPrices),
  poolTokens: many(poolTokens),
}));

export const tokenPrices = pgTable(
  "token_prices",
  {
    id: serial("id").primaryKey(),
    priceUSD: decimal("price_usd"),
    timestamp: timestamp("timestamp"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    tokenAddress: varchar("token_address"),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.tokenAddress, t.networkSlug, t.timestamp),
  }),
);

export const poolTokens = pgTable(
  "pool_tokens",
  {
    id: serial("id").primaryKey(),
    weight: decimal("weight"),
    tokenIndex: integer("token_index"),
    isExemptFromYieldProtocolFee: boolean("is_exempt_from_yield_protocol_fee"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
    tokenAddress: varchar("token_address"),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.poolExternalId, t.tokenAddress),
  }),
);

export const networks = pgTable("networks", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  slug: varchar("slug").unique().notNull(),
  chainId: varchar("chain_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const networkRelations = relations(networks, ({ many }) => ({
  pools: many(pools),
  blocks: many(blocks),
  tokens: many(tokens),
  poolTokenRateProviders: many(poolTokenRateProviders),
  poolTokenRateProvidersSnapshot: many(poolTokenRateProvidersSnapshot),
}));

export const poolSnapshots = pgTable(
  "pool_snapshots",
  {
    id: serial("id").primaryKey(),
    amounts: jsonb("amounts"),
    totalShares: decimal("total_shares"),
    swapVolume: decimal("swap_volume"),
    swapFees: decimal("swap_fees"),
    liquidity: decimal("liquidity"),
    timestamp: timestamp("timestamp"),
    protocolYieldFeeCache: decimal("protocol_yield_fee_cache"),
    protocolSwapFeeCache: decimal("protocol_swap_fee_cache"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    externalId: varchar("external_id").unique(),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
    rawData: jsonb("raw_data"),
  },
  (table) => ({
    timestampIdx: index().on(table.timestamp),
    createdAtIdx: index().on(table.createdAt),
    swapFeesIdx: index().on(table.swapFees),
  }),
);

export const calendar = pgTable(
  "calendar",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp").unique(),
  },
  (table) => ({
    timestampIdx: index().on(table.timestamp),
  }),
);

export const poolSnapshotsTemp = pgTable(
  "pool_snapshots_temp",
  {
    id: serial("id").primaryKey(),
    amounts: jsonb("amounts"),
    totalShares: decimal("total_shares"),
    swapVolume: decimal("swap_volume"),
    swapFees: decimal("swap_fees"),
    liquidity: decimal("liquidity"),
    timestamp: timestamp("timestamp"),
    protocolYieldFeeCache: decimal("protocol_yield_fee_cache"),
    protocolSwapFeeCache: decimal("protocol_swap_fee_cache"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    nextTimestampChange: timestamp("next_timestamp_change"),
    externalId: varchar("external_id").unique(),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
    rawData: jsonb("raw_data"),
  },
  (table) => ({
    timestampIdx: index().on(table.timestamp),
    nextTimestampChangeIdx: index().on(table.nextTimestampChange),
    createdAtIdx: index().on(table.createdAt),
  }),
);

export const poolSnapshotRelations = relations(poolSnapshots, ({ one }) => ({
  pool: one(pools, {
    fields: [poolSnapshots.poolExternalId],
    references: [pools.externalId],
  }),
}));

export const poolTokenRateProviders = pgTable("pool_rate_providers", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id").unique(),
  address: varchar("address"),
  vulnerabilityAffected: boolean("vulnerability_affected"),
  poolExternalId: varchar("pool_external_id").references(
    () => pools.externalId,
  ),
  tokenAddress: varchar("token_address"),
  networkSlug: varchar("network_slug").references(() => networks.slug),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  rawData: jsonb("raw_data"),
});

export const poolTokenRateProvidersSnapshot = pgTable(
  "pool_token_rate_providers_snapshot",
  {
    id: serial("id").primaryKey(),
    rate: decimal("rate"),
    blockNumber: integer("block_number"),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    externalId: varchar("external_id").unique(),
    rateProviderAddress: varchar("rate_provider_address"),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);

export const vebalRounds = pgTable("vebal_rounds", {
  id: serial("id").primaryKey(),
  endDate: timestamp("end_date").notNull(),
  startDate: timestamp("start_date").notNull(),
  roundNumber: integer("round_number").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gauges = pgTable(
  "gauges",
  {
    id: serial("id").primaryKey(),
    address: varchar("address"),
    isKilled: boolean("is_killed"),
    externalCreatedAt: timestamp("external_created_at"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.address, t.poolExternalId),
  }),
);

export const gaugeRelations = relations(gauges, ({ many }) => ({
  gaugeSnapshots: many(gaugeSnapshots),
}));

export const gaugeSnapshots = pgTable(
  "gauge_snapshots",
  {
    id: serial("id").primaryKey(),
    relativeWeight: decimal("relative_weight"),
    timestamp: timestamp("timestamp"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    blockNumber: integer("block_number"),
    gaugeAddress: varchar("gauge_address"),
    roundNumber: integer("round_number"),
    networkSlug: varchar("network_slug").references(() => networks.slug),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.timestamp, t.gaugeAddress, t.networkSlug),
  }),
);

export const poolTokenWeightsSnapshot = pgTable("pool_token_weights_snapshot", {
  id: serial("id").primaryKey(),
  weight: decimal("weight"),
  poolExternalId: varchar("pool_external_id").references(
    () => pools.externalId,
  ),
  tokenAddress: varchar("token_address"),
  externalId: varchar("external_id").unique(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vebalApr = pgTable("vebal_apr", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp"),
  value: decimal("value"),
  poolExternalId: varchar("pool_external_id").references(
    () => pools.externalId,
  ),
  externalId: varchar("external_id").unique(),
});

export const poolRewards = pgTable("pool_rewards", {
  id: serial("id").primaryKey(),
  poolExternalId: varchar("pool_external_id").references(
    () => pools.externalId,
  ),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  rate: decimal("rate"),
  tokenAddress: varchar("token_address"),
  networkSlug: varchar("network_slug").references(() => networks.slug),
  totalSupply: decimal("total_supply"),
  externalId: varchar("external_id").unique(),
  rawData: jsonb("raw_data"),
});

export const poolRewardsSnapshot = pgTable("pool_rewards_snapshot", {
  id: serial("id").primaryKey(),
  poolExternalId: varchar("pool_external_id").references(
    () => pools.externalId,
  ),
  timestamp: timestamp("timestamp"),
  tokenAddress: varchar("token_address"),
  totalSupply: decimal("total_supply"),
  yearlyAmount: decimal("yearly_amount"),
  externalId: varchar("external_id").unique(),
});

export const swapFeeApr = pgTable(
  "swap_fee_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp"),
    value: decimal("value"),
    collectedFeesUSD: decimal("collected_fees_usd"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
    externalId: varchar("external_id").unique(),
  },
  (t) => ({
    unq: unique().on(t.timestamp, t.poolExternalId),
  }),
);

export const rewardsTokenApr = pgTable(
  "rewards_token_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp"),
    tokenAddress: varchar("token_address"),
    value: decimal("value"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
  },
  (t) => ({
    unq: unique().on(t.timestamp, t.tokenAddress, t.poolExternalId),
  }),
);

export const yieldTokenApr = pgTable(
  "yield_token_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp"),
    tokenAddress: varchar("token_address"),
    value: decimal("value"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
    ),
    externalId: varchar("external_id").unique(),
  },
  (t) => ({
    unq: unique().on(t.timestamp, t.tokenAddress, t.poolExternalId),
  }),
);

export const balEmission = pgTable(
  "bal_emission",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp"),
    weekEmission: decimal("week_emission"),
  },
  (t) => ({
    unq: unique().on(t.timestamp, t.weekEmission),
  }),
);
