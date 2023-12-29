ALTER TABLE "rewards_token_apr" ADD COLUMN "period_start" timestamp;--> statement-breakpoint
ALTER TABLE "rewards_token_apr" ADD COLUMN "period_end" timestamp;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "decimals" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_rewards_pool_external_id_index" ON "pool_rewards" ("pool_external_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_rewards_network_slug_index" ON "pool_rewards" ("network_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_rewards_token_address_index" ON "pool_rewards" ("token_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_rewards_period_start_index" ON "pool_rewards" ("period_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_rewards_period_end_index" ON "pool_rewards" ("period_end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_snapshots_network_slug_index" ON "pool_snapshots" ("network_slug");--> statement-breakpoint
ALTER TABLE "pool_rewards" ADD CONSTRAINT "pool_rewards_period_start_period_end_pool_external_id_token_address_total_supply_unique" UNIQUE("period_start","period_end","pool_external_id","token_address","total_supply");--> statement-breakpoint
ALTER TABLE "pool_rate_providers" ADD CONSTRAINT "pool_rate_providers_address_token_address_vulnerability_affected_unique" UNIQUE("address","token_address","vulnerability_affected");