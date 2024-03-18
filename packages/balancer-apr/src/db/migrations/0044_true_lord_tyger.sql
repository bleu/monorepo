CREATE INDEX IF NOT EXISTS "token_prices_token_address_index" ON "token_prices" ("token_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_prices_timestamp_index" ON "token_prices" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_prices_network_slug_index" ON "token_prices" ("network_slug");