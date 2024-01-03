ALTER TABLE "gauge_snapshots" DROP CONSTRAINT "gauge_snapshots_timestamp_gauge_address_unique";--> statement-breakpoint
ALTER TABLE "gauges" DROP CONSTRAINT "gauges_address_network_slug_is_killed_unique";--> statement-breakpoint
ALTER TABLE "gauge_snapshots" ADD COLUMN "child_gauge_address" varchar;--> statement-breakpoint
ALTER TABLE "gauge_snapshots" ADD CONSTRAINT "gauge_snapshots_timestamp_gauge_address_child_gauge_address_unique" UNIQUE("timestamp","gauge_address","child_gauge_address");--> statement-breakpoint
ALTER TABLE "gauges" ADD CONSTRAINT "gauges_address_child_gauge_address_network_slug_is_killed_unique" UNIQUE("address","child_gauge_address","network_slug","is_killed");