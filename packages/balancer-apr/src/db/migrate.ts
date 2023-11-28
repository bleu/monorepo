/* eslint-disable no-console */
import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
// import { sql } from "@vercel/postgres";
import postgres from "postgres";

async function runMigrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error("POSTGRES_DATABASE is not defined");
  }

  const db = drizzle(postgres(process.env.DATABASE_URL));

  console.log("Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
}

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
