/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateToEpoch } from "@bleu-fi/utils/date";
import { and, asc, eq, gt, isNotNull } from "drizzle-orm";
import { Address } from "viem";

import { db } from "../../../db/index";
import {
  blocks,
  gauges,
  gaugeSnapshots,
  poolSnapshots,
  vebalRounds,
} from "../../../db/schema";
import { logIfVerbose } from "../../../index";
import { getPoolRelativeWeights } from "./getPoolRelativeWeights";

export async function extractGaugesSnapshot() {
  logIfVerbose("Starting Gauges Snapshot Extraction");

  try {
    // Fetch gauge addresses and corresponding timestamps
    const gaugeTimestamps = await db
      .select({
        gaugeAddress: gauges.address,
        timestamp: vebalRounds.startDate,
      })
      .from(poolSnapshots)
      .fullJoin(gauges, eq(poolSnapshots.poolExternalId, gauges.poolExternalId))
      .fullJoin(vebalRounds, eq(poolSnapshots.timestamp, vebalRounds.startDate))
      .fullJoin(blocks, eq(blocks.timestamp, poolSnapshots.timestamp))
      .where(
        and(
          gt(poolSnapshots.timestamp, gauges.externalCreatedAt),
          isNotNull(vebalRounds.startDate),
        ),
      )
      .orderBy(asc(vebalRounds.startDate));

    // Create tuples for batch processing
    const gaugeAddressTimestampTuples: [Address, number][] =
      gaugeTimestamps.map(({ gaugeAddress, timestamp }) => [
        gaugeAddress as Address,
        dateToEpoch(timestamp),
      ]);

    // Batch process to get relative weights
    logIfVerbose(
      `Fetching ${gaugeAddressTimestampTuples.length} relativeweight-timestamp pairs`,
    );
    const relativeWeights = await getPoolRelativeWeights(
      gaugeAddressTimestampTuples,
    );

    // Fetch round numbers for all timestamps in bulk
    const roundNumbers = await db
      .select({
        timestamp: vebalRounds.startDate,
        round_number: vebalRounds.roundNumber,
      })
      .from(vebalRounds);

    // Create a timestamp to round number mapping
    const roundNumberMap = roundNumbers.reduce(
      (map, { timestamp, round_number }) => {
        map[dateToEpoch(timestamp)] = round_number; // Ensure timestamp format aligns with what is used in gaugeAddressTimestampTuples
        return map;
      },
      {} as { [key: number]: number },
    );

    const insertData = []; // Array to hold records for batch insert

    for (const [
      gaugeAddress,
      epochTimestamp,
      relativeWeight,
    ] of relativeWeights) {
      const roundNumber = roundNumberMap[epochTimestamp];

      // Add record to insertData array if roundNumber exists
      if (roundNumber) {
        insertData.push({
          gaugeAddress,
          timestamp: new Date(epochTimestamp * 1000), // Convert back to Date object
          relativeWeight: String(relativeWeight),
          roundNumber,
        });
      }
    }
    // Perform a single batch insert if there are records to insert
    if (insertData.length > 0) {
      await db
        .insert(gaugeSnapshots)
        .values(insertData)
        .onConflictDoNothing()
        .execute();
    }
  } catch (error) {
    logIfVerbose(error);
  }
}
