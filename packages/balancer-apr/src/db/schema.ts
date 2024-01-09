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
    address: varchar("address"),
    symbol: varchar("symbol"),
    externalCreatedAt: timestamp("external_created_at", { withTimezone: true }),
    poolTypeVersion: decimal("pool_type_version"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.address, t.networkSlug),
    type: index().on(t.poolType),
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
    timestamp: timestamp("timestamp", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
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
    externalCreatedAt: timestamp("external_created_at", { withTimezone: true }),
    decimals: integer("decimals"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
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
    timestamp: timestamp("timestamp", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    tokenAddress: varchar("token_address"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.tokenAddress, t.networkSlug, t.timestamp),
    tokenAddr: index().on(t.tokenAddress),
    timestamp: index().on(t.timestamp),
    network: index().on(t.networkSlug),
  }),
);

export const poolTokens = pgTable(
  "pool_tokens",
  {
    id: serial("id").primaryKey(),
    weight: decimal("weight"),
    tokenIndex: integer("token_index"),
    isExemptFromYieldProtocolFee: boolean("is_exempt_from_yield_protocol_fee"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    tokenAddress: varchar("token_address"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    rawData: jsonb("raw_data"),
  },
  (t) => ({
    unq: unique().on(t.poolExternalId, t.tokenAddress),
    poolExternalId: index().on(t.poolExternalId),
    tokenAddr: index().on(t.tokenAddress),
    networkSlug: index().on(t.networkSlug),
    tokenIndex: index().on(t.tokenIndex),
  }),
);

export const networks = pgTable("networks", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  slug: varchar("slug").unique().notNull(),
  chainId: varchar("chain_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
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
    calculatedLiquidity: decimal("calculated_liquidity"),
    calculatedLiquidityError: decimal("calculated_liquidity_error"),
    timestamp: timestamp("timestamp", { withTimezone: true }),
    protocolYieldFeeCache: decimal("protocol_yield_fee_cache"),
    protocolSwapFeeCache: decimal("protocol_swap_fee_cache"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    externalId: varchar("external_id").unique(),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    rawData: jsonb("raw_data"),
  },
  (table) => ({
    timestampIdx: index().on(table.timestamp),
    createdAtIdx: index().on(table.createdAt),
    swapFeesIdx: index().on(table.swapFees),
    networkSlug: index().on(table.networkSlug),
    poolExternalId: index().on(table.poolExternalId),
  }),
);

export const calendar = pgTable(
  "calendar",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true }).unique(),
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
    timestamp: timestamp("timestamp", { withTimezone: true }),
    protocolYieldFeeCache: decimal("protocol_yield_fee_cache"),
    protocolSwapFeeCache: decimal("protocol_swap_fee_cache"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    nextTimestampChange: timestamp("next_timestamp_change", {
      withTimezone: true,
    }),
    externalId: varchar("external_id").unique(),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    rawData: jsonb("raw_data"),
  },
  (table) => ({
    timestampIdx: index().on(table.timestamp),
    nextTimestampChangeIdx: index().on(table.nextTimestampChange),
    createdAtIdx: index().on(table.createdAt),
    poolExternalId: index().on(table.poolExternalId),
  }),
);

export const poolSnapshotRelations = relations(poolSnapshots, ({ one }) => ({
  pool: one(pools, {
    fields: [poolSnapshots.poolExternalId],
    references: [pools.externalId],
  }),
}));

export const poolTokenRateProviders = pgTable(
  "pool_rate_providers",
  {
    id: serial("id").primaryKey(),
    externalId: varchar("external_id").unique(),
    address: varchar("address"),
    vulnerabilityAffected: boolean("vulnerability_affected"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    tokenAddress: varchar("token_address"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    rawData: jsonb("raw_data"),
  },
  (table) => ({
    unq: unique().on(
      table.address,
      table.tokenAddress,
      table.vulnerabilityAffected,
    ),
    poolExternalId: index().on(table.poolExternalId),
    networkSlug: index().on(table.networkSlug),
    tokenAddress: index().on(table.tokenAddress),
    address: index().on(table.address),
    vulnerabilityAffected: index().on(table.vulnerabilityAffected),
  }),
);

export const poolTokenRateProvidersSnapshot = pgTable(
  "pool_token_rate_providers_snapshot",
  {
    id: serial("id").primaryKey(),
    rate: decimal("rate"),
    blockNumber: integer("block_number"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    externalId: varchar("external_id").unique(),
    rateProviderAddress: varchar("rate_provider_address"),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const vebalRounds = pgTable("vebal_rounds", {
  id: serial("id").primaryKey(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  roundNumber: integer("round_number").unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const gauges = pgTable(
  "gauges",
  {
    id: serial("id").primaryKey(),
    address: varchar("address"),
    isKilled: boolean("is_killed"),
    externalCreatedAt: timestamp("external_created_at", { withTimezone: true }),
    childGaugeAddress: varchar("child_gauge_address"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    rawData: jsonb("raw_data"),
  },
  (table) => ({
    unq: unique().on(table.address, table.poolExternalId, table.isKilled),
    networkAddrUnq: unique().on(
      table.address,
      table.childGaugeAddress,
      table.networkSlug,
      table.isKilled,
    ),
    poolExternalId: index().on(table.poolExternalId),
    networkSlug: index().on(table.networkSlug),
    address: index().on(table.address),
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
    timestamp: timestamp("timestamp", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    blockNumber: integer("block_number"),
    gaugeAddress: varchar("gauge_address").notNull(),
    childGaugeAddress: varchar("child_gauge_address"),
    roundNumber: integer("round_number"),
    workingSupply: decimal("working_supply"),
    totalSupply: decimal("total_supply"),
    inflationRate: decimal("inflation_rate"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (t) => ({
    unq: unique().on(
      t.timestamp,
      t.gaugeAddress,
      t.childGaugeAddress,
      t.networkSlug,
    ),
    gaugeAddress: index().on(t.gaugeAddress),
    childGaugeAddress: index().on(t.childGaugeAddress),
    timestamp: index().on(t.timestamp),
    networkSlug: index().on(t.networkSlug),
    roundNumber: index().on(t.roundNumber),
  }),
);

export const poolTokenWeightsSnapshot = pgTable(
  "pool_token_weights_snapshot",
  {
    id: serial("id").primaryKey(),
    weight: decimal("weight"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    tokenAddress: varchar("token_address"),
    externalId: varchar("external_id").unique(),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    poolExternalId: index().on(table.poolExternalId),
    tokenAddress: index().on(table.tokenAddress),
    timestamp: index().on(table.timestamp),
  }),
);

export const vebalApr = pgTable(
  "vebal_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true }),
    value: decimal("value"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    unq: unique().on(table.timestamp, table.poolExternalId),
    poolExternalId: index().on(table.poolExternalId),
    timestamp: index().on(table.timestamp),
  }),
);

export const poolRewards = pgTable(
  "pool_rewards",
  {
    id: serial("id").primaryKey(),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    rate: decimal("rate"),
    tokenAddress: varchar("token_address"),
    networkSlug: varchar("network_slug").references(() => networks.slug, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    totalSupply: decimal("total_supply"),
    externalId: varchar("external_id").unique(),
    rawData: jsonb("raw_data"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    unq: unique().on(
      table.periodStart,
      table.periodEnd,
      table.poolExternalId,
      table.tokenAddress,
      table.totalSupply,
    ),
    poolExternalId: index().on(table.poolExternalId),
    networkSlug: index().on(table.networkSlug),
    tokenAddress: index().on(table.tokenAddress),
    periodStart: index().on(table.periodStart),
    periodEnd: index().on(table.periodEnd),
  }),
);

export const poolRewardsSnapshot = pgTable("pool_rewards_snapshot", {
  id: serial("id").primaryKey(),
  poolExternalId: varchar("pool_external_id").references(
    () => pools.externalId,
    { onDelete: "cascade", onUpdate: "cascade" },
  ),
  timestamp: timestamp("timestamp", { withTimezone: true }),
  tokenAddress: varchar("token_address"),
  totalSupply: decimal("total_supply"),
  yearlyAmount: decimal("yearly_amount"),
  externalId: varchar("external_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const swapFeeApr = pgTable(
  "swap_fee_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true }),
    value: decimal("value"),
    collectedFeesUSD: decimal("collected_fees_usd"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    externalId: varchar("external_id").unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    poolExternalId: index().on(table.poolExternalId),
    timestamp: index().on(table.timestamp),
    unq: unique().on(table.timestamp, table.poolExternalId),
  }),
);

export const rewardsTokenApr = pgTable(
  "rewards_token_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true }),
    tokenAddress: varchar("token_address"),
    value: decimal("value"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    poolExternalId: index().on(table.poolExternalId),
    timestamp: index().on(table.timestamp),
    unq: unique().on(
      table.timestamp,
      table.tokenAddress,
      table.poolExternalId,
      table.periodStart,
      table.periodEnd,
    ),
  }),
);

export const yieldTokenApr = pgTable(
  "yield_token_apr",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true }),
    tokenAddress: varchar("token_address"),
    value: decimal("value"),
    poolExternalId: varchar("pool_external_id").references(
      () => pools.externalId,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),
    externalId: varchar("external_id").unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    poolExternalId: index().on(table.poolExternalId),
    timestamp: index().on(table.timestamp),
    unq: unique().on(table.timestamp, table.tokenAddress, table.poolExternalId),
  }),
);

export const balEmission = pgTable(
  "bal_emission",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true }).unique(),
    weekEmission: decimal("week_emission"),
  },
  (t) => ({
    unq: unique().on(t.timestamp, t.weekEmission),
  }),
);
