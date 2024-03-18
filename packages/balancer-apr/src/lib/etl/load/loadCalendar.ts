import { sql } from "drizzle-orm";

import { db } from "../../../db/index";
import { BALANCER_START_DATE } from "../../../index";

export async function loadCalendar() {
  return await db.execute(sql`
  INSERT INTO calendar (timestamp)
  SELECT
	generate_series('${sql.raw(
    BALANCER_START_DATE,
  )}'::timestamp, CURRENT_DATE - interval '1 day', '1 day'::INTERVAL) AS "timestamp"
  ON CONFLICT (timestamp) DO NOTHING;
  `);
}
