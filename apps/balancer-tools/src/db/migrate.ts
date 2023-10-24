/* eslint-disable no-console */
import "dotenv/config";

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

async function runMigrate() {
  if (!process.env.POSTGRES_DATABASE) {
    throw new Error("POSTGRES_DATABASE is not defined");
  }
  const db = drizzle(sql);

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
