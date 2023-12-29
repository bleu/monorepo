ALTER TABLE "vebal_apr" DROP CONSTRAINT "vebal_apr_external_id_unique";--> statement-breakpoint
ALTER TABLE "vebal_apr" DROP COLUMN IF EXISTS "external_id";