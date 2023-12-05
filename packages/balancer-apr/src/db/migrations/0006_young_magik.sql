ALTER TABLE "pool_rate_providers" ADD COLUMN "external_id" varchar;--> statement-breakpoint
ALTER TABLE "pool_rate_providers" ADD COLUMN "pool_external_id" varchar;--> statement-breakpoint
ALTER TABLE "pool_rate_providers" ADD COLUMN "token_address" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rate_providers" ADD CONSTRAINT "pool_rate_providers_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pool_rate_providers" ADD CONSTRAINT "pool_rate_providers_external_id_unique" UNIQUE("external_id");