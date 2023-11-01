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
CREATE TABLE IF NOT EXISTS "gauge_relative_weights" (
	"id" serial PRIMARY KEY NOT NULL,
	"relative_weight" bigint,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"block_id" integer,
	"gauge_id" integer,
	"raw_data" jsonb
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
CREATE TABLE IF NOT EXISTS "pool_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"amounts" jsonb,
	"total_shares" numeric,
	"swap_volume" numeric,
	"swap_fees" numeric,
	"liquidity" numeric,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"external_id" varchar,
	"pool_external_id" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pool_snapshots_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_rate_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate" numeric,
	"vulnerability_affected" boolean,
	"external_created_at" timestamp,
	"pool_token_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"raw_data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pool_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"pool_external_id" varchar,
	"token_id" integer,
	"token_address" varchar,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pool_tokens_pool_external_id_token_id_unique" UNIQUE("pool_external_id","token_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pools" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar,
	"pool_type" varchar,
	"name" varchar,
	"address" varchar,
	"total_liquidity" numeric,
	"symbol" varchar,
	"external_created_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"network_slug" varchar,
	"raw_data" jsonb,
	CONSTRAINT "pools_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "pools_address_network_slug_unique" UNIQUE("address","network_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_usd" numeric,
	"timestamp" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"token_id" integer,
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
CREATE TABLE IF NOT EXISTS "vebal_rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"end_date" timestamp,
	"start_date" timestamp,
	"round_number" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocks" ADD CONSTRAINT "blocks_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauge_relative_weights" ADD CONSTRAINT "gauge_relative_weights_block_id_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauge_relative_weights" ADD CONSTRAINT "gauge_relative_weights_gauge_id_gauges_id_fk" FOREIGN KEY ("gauge_id") REFERENCES "gauges"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "pool_snapshots" ADD CONSTRAINT "pool_snapshots_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "pool_tokens" ADD CONSTRAINT "pool_tokens_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "token_prices" ADD CONSTRAINT "token_prices_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE no action ON UPDATE no action;
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
