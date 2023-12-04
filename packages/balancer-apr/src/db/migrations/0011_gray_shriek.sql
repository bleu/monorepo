ALTER TABLE "pool_token_rate_providers_snapshot" DROP CONSTRAINT "pool_token_rate_providers_snapshot_pool_external_id_pools_external_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_token_rate_providers_snapshot" DROP COLUMN IF EXISTS "pool_external_id";