ALTER TABLE "pool_token_rate_providers_snapshot" ADD COLUMN "block_number" integer;--> statement-breakpoint
ALTER TABLE "pool_token_rate_providers_snapshot" ADD COLUMN "pool_external_id" varchar;--> statement-breakpoint
ALTER TABLE "pool_token_rate_providers_snapshot" ADD COLUMN "network_slug" varchar;--> statement-breakpoint
ALTER TABLE "pool_token_rate_providers_snapshot" ADD COLUMN "external_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_token_rate_providers_snapshot" ADD CONSTRAINT "pool_token_rate_providers_snapshot_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_token_rate_providers_snapshot" ADD CONSTRAINT "pool_token_rate_providers_snapshot_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pool_token_rate_providers_snapshot" ADD CONSTRAINT "pool_token_rate_providers_snapshot_external_id_unique" UNIQUE("external_id");