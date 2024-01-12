ALTER TABLE "pool_snapshots_temp" DROP CONSTRAINT "pool_snapshots_temp_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "pool_snapshots" ADD COLUMN "network_slug" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots" ADD CONSTRAINT "pool_snapshots_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_snapshots_temp" ADD CONSTRAINT "pool_snapshots_temp_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
