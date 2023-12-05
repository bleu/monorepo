ALTER TABLE "blocks" ADD COLUMN "external_id" varchar;--> statement-breakpoint
ALTER TABLE "blocks" DROP COLUMN IF EXISTS "raw_data";--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_external_id_unique" UNIQUE("external_id");