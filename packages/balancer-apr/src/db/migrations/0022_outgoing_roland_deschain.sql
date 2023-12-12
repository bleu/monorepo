ALTER TABLE "pool_rewards" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pool_rewards" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;