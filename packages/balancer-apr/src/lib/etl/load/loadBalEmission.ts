import { dateToEpoch } from "@bleu-fi/utils/date";

import { db } from "../../../db/index";
import { balEmission, calendar } from "../../../db/schema";
import { addToTable, logIfVerbose } from "../../../index";
import * as balEmissions from "../../../lib/balancer/emissions";

export async function loadBalEmission() {
  logIfVerbose("Loading BAL emission");
  const timestamps = await db
    .selectDistinct({ timestamp: calendar.timestamp })
    .from(calendar);

  const emissionsToInsert = [];

  for (const { timestamp } of timestamps) {
    if (!timestamp) continue;
    try {
      const weeklyBalEmission = balEmissions.weekly(dateToEpoch(timestamp));

      // Add emission data to the array
      emissionsToInsert.push({
        timestamp: timestamp,
        weekEmission: String(weeklyBalEmission),
      });
    } catch (error) {
      logIfVerbose(`${error}`);
    }
  }

  await addToTable(balEmission, emissionsToInsert);
}
