ALTER TABLE "blocks" DROP CONSTRAINT "blocks_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "gauge_snapshots" DROP CONSTRAINT "gauge_snapshots_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "gauges" DROP CONSTRAINT "gauges_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_rewards" DROP CONSTRAINT "pool_rewards_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_rewards_snapshot" DROP CONSTRAINT "pool_rewards_snapshot_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_snapshots" DROP CONSTRAINT "pool_snapshots_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_snapshots_temp" DROP CONSTRAINT "pool_snapshots_temp_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_rate_providers" DROP CONSTRAINT "pool_rate_providers_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_token_rate_providers_snapshot" DROP CONSTRAINT "pool_token_rate_providers_snapshot_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "pool_token_weights_snapshot" DROP CONSTRAINT "pool_token_weights_snapshot_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_tokens" DROP CONSTRAINT "pool_tokens_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pools" DROP CONSTRAINT "pools_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "rewards_token_apr" DROP CONSTRAINT "rewards_token_apr_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "swap_fee_apr" DROP CONSTRAINT "swap_fee_apr_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "token_prices" DROP CONSTRAINT "token_prices_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "vebal_apr" DROP CONSTRAINT "vebal_apr_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "yield_token_apr" DROP CONSTRAINT "yield_token_apr_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocks" ADD CONSTRAINT "blocks_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauge_snapshots" ADD CONSTRAINT "gauge_snapshots_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauges" ADD CONSTRAINT "gauges_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rewards" ADD CONSTRAINT "pool_rewards_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rewards_snapshot" ADD CONSTRAINT "pool_rewards_snapshot_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots" ADD CONSTRAINT "pool_snapshots_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots_temp" ADD CONSTRAINT "pool_snapshots_temp_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rate_providers" ADD CONSTRAINT "pool_rate_providers_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_token_rate_providers_snapshot" ADD CONSTRAINT "pool_token_rate_providers_snapshot_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_token_weights_snapshot" ADD CONSTRAINT "pool_token_weights_snapshot_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_tokens" ADD CONSTRAINT "pool_tokens_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pools" ADD CONSTRAINT "pools_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rewards_token_apr" ADD CONSTRAINT "rewards_token_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "swap_fee_apr" ADD CONSTRAINT "swap_fee_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "token_prices" ADD CONSTRAINT "token_prices_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vebal_apr" ADD CONSTRAINT "vebal_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "yield_token_apr" ADD CONSTRAINT "yield_token_apr_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
