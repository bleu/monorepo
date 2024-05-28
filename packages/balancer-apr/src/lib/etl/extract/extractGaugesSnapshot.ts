/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateToEpoch, epochToDate } from "@bleu/utils/date";
import { sql } from "drizzle-orm";
import { addToTable } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";
import { Address } from "viem";

import { db } from "../../../db/index";
import { gaugeSnapshots } from "../../../db/schema";
import { getGaugeWorkingSupply } from "./getGaugeWorkingSupply";
import { getPoolRelativeWeights } from "./getPoolRelativeWeights";

export async function extractGaugesSnapshot() {
  logIfVerbose("Starting Gauges Snapshot Extraction");

  try {
    // Fetch gauge addresses and corresponding timestamps
    const gaugeTimestamps = await db.execute<{
      gaugeAddress: Address;
      childGaugeAddress: Address;
      timestamp: Date;
      network: string;
      round: number;
      block: number;
    }>(sql`
    SELECT DISTINCT
    g.address AS "gaugeAddress",
    g.child_gauge_address AS "childGaugeAddress",
    c. "timestamp" AS "timestamp",
    p.network_slug AS "network",
    vr.round_number AS "round",
    b. "number" AS "block"
  FROM
    pools p
    JOIN calendar c ON c. "timestamp" >= p.external_created_at
    JOIN blocks b ON b. "timestamp" = c. "timestamp"
      AND b.network_slug = p.network_slug
    JOIN gauges g ON g.network_slug = p.network_slug
      AND g.pool_external_id = p.external_id
    JOIN vebal_rounds vr ON c. "timestamp" BETWEEN vr.start_date
      AND vr.end_date
    LEFT JOIN gauge_snapshots gs ON gs.gauge_address = g.address
      AND gs.network_slug = g.network_slug
      AND c. "timestamp" = gs. "timestamp"
      AND(gs.child_gauge_address = g.child_gauge_address
        OR(gs.child_gauge_address IS NULL
          AND g.child_gauge_address IS NULL))
  WHERE
    p.external_id IS NOT NULL
    AND p.external_created_at IS NOT NULL
    AND c. "timestamp" >= g.external_created_at
    AND gs.id IS NULL
  ORDER BY
    g.address,
    g.child_gauge_address,
    c. "timestamp" desc;`);

    // Create tuples for batch processing
    const gaugeAddressTimestampTuples: [Address, number][] =
      gaugeTimestamps.map(({ gaugeAddress, timestamp }) => [
        gaugeAddress as Address,
        dateToEpoch(timestamp),
      ]);

    const [relativeWeights, workingSupplies] = await Promise.all([
      getPoolRelativeWeights(gaugeAddressTimestampTuples),
      getGaugeWorkingSupply(
        gaugeTimestamps.map(
          ({ gaugeAddress, childGaugeAddress, timestamp, network, block }) => [
            network === "ethereum"
              ? (gaugeAddress as Address)
              : childGaugeAddress
                ? (childGaugeAddress as Address)
                : (gaugeAddress as Address),
            network!,
            dateToEpoch(timestamp),
            block!,
          ]
        )
      ),
    ]);

    const insertData = relativeWeights.map(
      ([gaugeAddress, epochTimestamp, relativeWeight], idx) => {
        return {
          gaugeAddress,
          timestamp: epochToDate(epochTimestamp),
          relativeWeight: String(relativeWeight),
          roundNumber: gaugeTimestamps[idx].round,
          childGaugeAddress: gaugeTimestamps[idx].childGaugeAddress,
          networkSlug: gaugeTimestamps[idx].network,
          blockNumber: gaugeTimestamps[idx].block,
          ...workingSupplies[idx],
        };
      }
    );

    if (insertData.length > 0)
      return await addToTable(gaugeSnapshots, insertData);
  } catch (error) {
    logIfVerbose(error);
  }
}
