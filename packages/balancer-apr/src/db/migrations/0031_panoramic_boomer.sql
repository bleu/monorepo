ALTER TABLE "gauge_snapshots" DROP CONSTRAINT "gauge_snapshots_timestamp_gauge_address_network_slug_unique";--> statement-breakpoint
ALTER TABLE "gauge_snapshots" DROP CONSTRAINT "gauge_snapshots_network_slug_networks_slug_fk";
--> statement-breakpoint
ALTER TABLE "gauge_snapshots" DROP COLUMN IF EXISTS "network_slug";--> statement-breakpoint
ALTER TABLE "gauge_snapshots" ADD CONSTRAINT "gauge_snapshots_timestamp_gauge_address_unique" UNIQUE("timestamp","gauge_address");