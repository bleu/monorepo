CREATE TABLE IF NOT EXISTS "pool_rewards_snapshot" (
	"id" serial PRIMARY KEY NOT NULL,
	"pool_external_id" varchar,
	"timestamp" timestamp,
	"token_address" varchar,
	"total_supply" numeric,
	"yearly_amount" numeric,
	"external_id" varchar,
	CONSTRAINT "pool_rewards_snapshot_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_rewards_snapshot" ADD CONSTRAINT "pool_rewards_snapshot_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
