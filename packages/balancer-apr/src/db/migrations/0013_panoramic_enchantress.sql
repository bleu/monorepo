CREATE TABLE IF NOT EXISTS "pool_token_weights_snapshot" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight" numeric,
	"pool_external_id" varchar,
	"token_address" varchar,
	"external_id" varchar,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pool_token_weights_snapshot_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pool_token_weights_snapshot" ADD CONSTRAINT "pool_token_weights_snapshot_pool_external_id_pools_external_id_fk" FOREIGN KEY ("pool_external_id") REFERENCES "pools"("external_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
