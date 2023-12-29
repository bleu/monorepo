ALTER TABLE "pool_snapshots_temp" ADD COLUMN "network_slug" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots_temp" ADD CONSTRAINT "pool_snapshots_temp_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
