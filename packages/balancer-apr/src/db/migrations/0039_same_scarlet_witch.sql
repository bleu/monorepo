ALTER TABLE "gauge_snapshots" ALTER COLUMN "gauge_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gauge_snapshots" DROP COLUMN IF EXISTS "raw_data";