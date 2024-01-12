/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateToEpoch } from "@bleu-fi/utils/date";
import { and, between, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { Address } from "viem";

import { db } from "../../../db/index";
import {
  blocks,
  gauges,
  gaugeSnapshots,
  poolSnapshots,
  vebalRounds,
} from "../../../db/schema";
import { addToTable, logIfVerbose } from "../../../index";
import { getGaugeWorkingSupply } from "./getGaugeWorkingSupply";
import { getPoolRelativeWeights } from "./getPoolRelativeWeights";

export async function extractGaugesSnapshot() {
  logIfVerbose("Starting Gauges Snapshot Extraction");

  try {
    // Fetch gauge addresses and corresponding timestamps
    const gaugeTimestamps = await db
      .select({
        gaugeAddress: gauges.address,
        childGaugeAddress: gauges.childGaugeAddress,
        timestamp: poolSnapshots.timestamp,
        round: vebalRounds.roundNumber,
        network: poolSnapshots.networkSlug,
        block: blocks.number,
      })
      .from(poolSnapshots)
      .innerJoin(
        blocks,
        and(
          eq(poolSnapshots.timestamp, blocks.timestamp),
          eq(poolSnapshots.networkSlug, blocks.networkSlug),
        ),
      )
      .innerJoin(
        gauges,
        eq(poolSnapshots.poolExternalId, gauges.poolExternalId),
      )
      .innerJoin(
        vebalRounds,
        between(
          poolSnapshots.timestamp,
          vebalRounds.startDate,
          vebalRounds.endDate,
        ),
      )
      .leftJoin(
        gaugeSnapshots,
        and(
          eq(gaugeSnapshots.timestamp, poolSnapshots.timestamp),
          eq(gauges.address, gaugeSnapshots.gaugeAddress),
        ),
      )
      .where(
        and(
          isNull(gaugeSnapshots.timestamp),
          eq(gauges.isKilled, false),
          isNotNull(gauges.address),
        ),
      )
      .orderBy(desc(vebalRounds.startDate));

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
              : (childGaugeAddress as Address),
            network!,
            dateToEpoch(timestamp),
            block!,
          ],
        ),
      ),
    ]);

    const insertData = relativeWeights.map(
      ([gaugeAddress, epochTimestamp, relativeWeight], idx) => {
        return {
          gaugeAddress,
          timestamp: new Date(epochTimestamp * 1000),
          relativeWeight: String(relativeWeight),
          roundNumber: gaugeTimestamps[idx].round,
          childGaugeAddress: gaugeTimestamps[idx].childGaugeAddress,
          networkSlug: gaugeTimestamps[idx].network,
          block: gaugeTimestamps[idx].block,
          ...workingSupplies[idx],
        };
      },
    );

    if (insertData.length > 0)
      return await addToTable(gaugeSnapshots, insertData, {
        target: [
          gaugeSnapshots.timestamp,
          gaugeSnapshots.gaugeAddress,
          gaugeSnapshots.childGaugeAddress,
        ],
        set: { totalSupply: sql`excluded.total_supply` },
      });
  } catch (error) {
    logIfVerbose(error);
  }
}
