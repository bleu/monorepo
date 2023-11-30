/* eslint-disable no-console */
// import { sql } from "@vercel/postgres";

import { type Logger } from "drizzle-orm/logger";
// import { drizzle } from "drizzle-orm/vercel-postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    if (process.env.NODE_ENV === "production") return;

    console.debug("___QUERY___");
    console.debug(query);
    console.debug(params);
    console.debug("___END_QUERY___");
  }
}

export const db = drizzle(postgres(process.env.DATABASE_URL!), {
  schema,
  logger: new QueryLogger(),
});
