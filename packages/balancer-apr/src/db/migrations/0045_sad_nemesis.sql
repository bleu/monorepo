CREATE INDEX IF NOT EXISTS "pool_tokens_token_address_index" ON "pool_tokens" ("token_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_tokens_network_slug_index" ON "pool_tokens" ("network_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pool_tokens_token_index_index" ON "pool_tokens" ("token_index");