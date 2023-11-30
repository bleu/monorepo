CREATE TABLE IF NOT EXISTS "calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	CONSTRAINT "calendar_timestamp_unique" UNIQUE("timestamp")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "calendar_timestamp_index" ON "calendar" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_snapshots_timestamp_index" ON "pool_snapshots" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_snapshots_created_at_index" ON "pool_snapshots" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_snapshots_temp_timestamp_index" ON "pool_snapshots_temp" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_snapshots_temp_next_timestamp_change_index" ON "pool_snapshots_temp" ("next_timestamp_change");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_snapshots_temp_created_at_index" ON "pool_snapshots_temp" ("created_at");