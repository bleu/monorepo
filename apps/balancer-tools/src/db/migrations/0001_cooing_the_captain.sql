ALTER TABLE "swap_fee_apr" ADD COLUMN "external_id" varchar;--> statement-breakpoint
ALTER TABLE "swap_fee_apr" ADD CONSTRAINT "swap_fee_apr_external_id_unique" UNIQUE("external_id");