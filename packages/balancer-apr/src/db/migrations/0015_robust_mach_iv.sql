ALTER TABLE "pool_rewards" DROP CONSTRAINT "pool_rewards_pool_external_id_token_address_network_slug_unique";--> statement-breakpoint
ALTER TABLE "pool_rewards" ADD COLUMN "rate" numeric;--> statement-breakpoint
ALTER TABLE "pool_rewards" ADD COLUMN "external_id" varchar;--> statement-breakpoint
ALTER TABLE "pool_rewards" DROP COLUMN IF EXISTS "yearly_amount";--> statement-breakpoint
ALTER TABLE "pool_rewards" ADD CONSTRAINT "pool_rewards_external_id_unique" UNIQUE("external_id");