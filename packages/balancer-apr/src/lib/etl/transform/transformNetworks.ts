import { sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

import { db } from "../../../db/index";

export async function transformNetworks(table: PgTable, key = "network") {
  await db.execute(sql`
INSERT INTO networks (slug)
SELECT
  CASE
    WHEN LOWER(raw_data->>'${sql.raw(key)}') = 'zkevm' THEN 'polygon-zkevm'
    WHEN LOWER(raw_data->>'${sql.raw(key)}') = 'mainnet' THEN 'ethereum'
    ELSE LOWER(raw_data->>'${sql.raw(key)}')
  END
FROM ${table}
WHERE LOWER(raw_data->>'${sql.raw(key)}') IS NOT NULL
ON CONFLICT (slug) DO NOTHING;
  `);
}
