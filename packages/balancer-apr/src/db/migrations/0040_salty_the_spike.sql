ALTER TABLE "gauge_snapshots" ADD COLUMN "network_slug" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gauge_snapshots_gauge_address_index" ON "gauge_snapshots" ("gauge_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gauge_snapshots_child_gauge_address_index" ON "gauge_snapshots" ("child_gauge_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gauge_snapshots_timestamp_index" ON "gauge_snapshots" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gauge_snapshots_network_slug_index" ON "gauge_snapshots" ("network_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gauge_snapshots_round_number_index" ON "gauge_snapshots" ("round_number");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gauge_snapshots" ADD CONSTRAINT "gauge_snapshots_network_slug_networks_slug_fk" FOREIGN KEY ("network_slug") REFERENCES "networks"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
