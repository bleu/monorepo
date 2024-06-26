import { dateToEpoch } from "@bleu/utils/date";
import { and, eq, isNull } from "drizzle-orm";
import { addToTable } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";

import { db } from "../../../db/index";
import { balEmission, calendar } from "../../../db/schema";
import * as balEmissions from "../../../lib/balancer/emissions";

export async function loadBalEmission() {
  logIfVerbose("Loading BAL emission");

  const timestamps = await db
    .select({
      timestamp: calendar.timestamp,
    })
    .from(calendar)
    .leftJoin(balEmission, and(eq(balEmission.timestamp, calendar.timestamp)))
    .where(isNull(balEmission.id));

  if (timestamps.length === 0) {
    logIfVerbose("No BAL emission to load");
    return;
  }

  await addToTable(
    balEmission,
    timestamps.map(({ timestamp }) => ({
      timestamp,
      weekEmission: String(balEmissions.weekly(dateToEpoch(timestamp))),
    })),
  );
}
