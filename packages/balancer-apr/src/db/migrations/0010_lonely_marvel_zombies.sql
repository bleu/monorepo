ALTER TABLE "pool_rate_providers" ADD COLUMN "network_slug" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rate_providers" ADD CONSTRAINT "pool_rate_providers_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
