CREATE TABLE IF NOT EXISTS "bal_emission" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"week_emission" numeric,
	CONSTRAINT "bal_emission_timestamp_week_emission_unique" UNIQUE("timestamp","week_emission")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "blocks_number_network_slug_unique" UNIQUE("number","network_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gauge_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"relative_weight" numeric,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"block_number" integer,
	"gauge_address" varchar,
	"round_number" integer,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "gauge_snapshots_timestamp_gauge_address_network_slug_unique" UNIQUE("timestamp","gauge_address","network_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gauges" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar,
	"is_killed" boolean,
	"external_created_at" timestamp,
	"pool_external_id" varchar,
	"network_slug" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"raw_data" jsonb,
	CONSTRAINT "gauges_address_pool_external_id_unique" UNIQUE("address","pool_external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "networks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"slug" varchar NOT NULL,
	"chain_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "networks_slug_unique" UNIQUE("slug"),
	CONSTRAINT "networks_chain_id_unique" UNIQUE("chain_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_address" varchar,
	"network_slug" varchar,
	"start_at" numeric,
	"end_at" numeric,
	"yearly_amount" numeric,
	"total_supply" numeric,
	"pool_external_id" varchar,
	CONSTRAINT "pool_rewards_pool_external_id_token_address_network_slug_unique" UNIQUE("pool_external_id","token_address","network_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"amounts" jsonb,
	"total_shares" numeric,
	"swap_volume" numeric,
	"swap_fees" numeric,
	"liquidity" numeric,
	"timestamp" timestamp,
	"protocol_yield_fee_cache" numeric,
	"protocol_swap_fee_cache" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"external_id" varchar,
	"pool_external_id" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pool_snapshots_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_snapshots_temp" (
	"id" serial PRIMARY KEY NOT NULL,
	"amounts" jsonb,
	"total_shares" numeric,
	"swap_volume" numeric,
	"swap_fees" numeric,
	"liquidity" numeric,
	"timestamp" timestamp,
	"protocol_yield_fee_cache" numeric,
	"protocol_swap_fee_cache" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"external_id" varchar,
	"pool_external_id" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pool_snapshots_temp_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_rate_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar,
	"vulnerability_affected" boolean,
	"external_created_at" timestamp,
	"pool_token_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"raw_data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_token_rate_providers_snapshot" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate" numeric,
	"block_start" integer,
	"block_end" integer,
	"external_created_at" timestamp,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight" numeric,
	"token_index" integer,
	"is_exempt_from_yield_protocol_fee" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"pool_external_id" varchar,
	"token_address" varchar,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pool_tokens_pool_external_id_token_address_unique" UNIQUE("pool_external_id","token_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pools" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar,
	"pool_type" varchar,
	"name" varchar,
	"address" varchar,
	"total_liquidity" varchar,
	"symbol" varchar,
	"external_created_at" timestamp,
	"pool_type_version" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pools_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "pools_address_network_slug_unique" UNIQUE("address","network_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rewards_token_apr" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"token_address" varchar,
	"value" numeric,
	"pool_external_id" varchar,
	CONSTRAINT "rewards_token_apr_timestamp_token_address_pool_external_id_unique" UNIQUE("timestamp","token_address","pool_external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "swap_fee_apr" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"value" numeric,
	"collected_fees_usd" numeric,
	"pool_external_id" varchar,
	"external_id" varchar,
	CONSTRAINT "swap_fee_apr_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "swap_fee_apr_timestamp_pool_external_id_unique" UNIQUE("timestamp","pool_external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_usd" numeric,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"token_address" varchar,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "token_prices_token_address_network_slug_timestamp_unique" UNIQUE("token_address","network_slug","timestamp")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar,
	"symbol" varchar,
	"name" varchar,
	"logo_uri" varchar,
	"external_created_at" timestamp,
	"network_slug" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"raw_data" jsonb,
	CONSTRAINT "tokens_address_network_slug_unique" UNIQUE("address","network_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vebal_apr" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"value" numeric,
	"pool_external_id" varchar,
	"external_id" varchar,
	CONSTRAINT "vebal_apr_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vebal_rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"end_date" timestamp,
	"start_date" timestamp,
	"round_number" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vebal_rounds_round_number_unique" UNIQUE("round_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "yield_token_apr" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"token_address" varchar,
	"value" numeric,
	"pool_external_id" varchar,
	CONSTRAINT "yield_token_apr_timestamp_token_address_pool_external_id_unique" UNIQUE("timestamp","token_address","pool_external_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocks" ADD CONSTRAINT "blocks_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauge_snapshots" ADD CONSTRAINT "gauge_snapshots_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauges" ADD CONSTRAINT "gauges_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauges" ADD CONSTRAINT "gauges_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rewards" ADD CONSTRAINT "pool_rewards_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rewards" ADD CONSTRAINT "pool_rewards_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots" ADD CONSTRAINT "pool_snapshots_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots_temp" ADD CONSTRAINT "pool_snapshots_temp_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rate_providers" ADD CONSTRAINT "pool_rate_providers_pool_token_id_pool_tokens_id_fk" FOREIGN KEY ("pool_token_id") REFERENCES "pool_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_tokens" ADD CONSTRAINT "pool_tokens_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_tokens" ADD CONSTRAINT "pool_tokens_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pools" ADD CONSTRAINT "pools_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rewards_token_apr" ADD CONSTRAINT "rewards_token_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "swap_fee_apr" ADD CONSTRAINT "swap_fee_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "token_prices" ADD CONSTRAINT "token_prices_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vebal_apr" ADD CONSTRAINT "vebal_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "yield_token_apr" ADD CONSTRAINT "yield_token_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
