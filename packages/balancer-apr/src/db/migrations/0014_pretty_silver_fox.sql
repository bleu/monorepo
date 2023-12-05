ALTER TABLE "yield_token_apr" ADD COLUMN "external_id" varchar;--> statement-breakpoint
ALTER TABLE "yield_token_apr" ADD CONSTRAINT "yield_token_apr_external_id_unique" UNIQUE("external_id");