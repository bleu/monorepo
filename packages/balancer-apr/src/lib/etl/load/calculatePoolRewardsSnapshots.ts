import { SECONDS_IN_YEAR } from "@bleu-fi/utils/date";
import { sql } from "drizzle-orm";
import { addToTable } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";

import { db } from "../../../db/index";
import { poolRewardsSnapshot } from "../../../db/schema";

export async function calculatePoolRewardsSnapshots() {
  logIfVerbose("Calculating pool rewards snapshots");

  const poolRewardsPerDay: {
    snapshot_date: Date;
    rate: string;
    pool_external_id: string;
    token_address: string;
    network_slug: string;
    total_supply: string;
    period_start: Date;
    period_end: Date;
  }[] = await db.execute(sql`
  WITH date_series AS (
    SELECT generate_series(
        MIN(period_start),
        MAX(period_end),
        '1 day'
    )::date AS snapshot_date
    FROM pool_rewards
),
reward_calculations AS (
    SELECT
        ds.snapshot_date,
        pr.rate,
        pr.pool_external_id,
        pr.token_address,
        pr.network_slug,
        pr.total_supply,
        pr.period_start,
        pr.period_end
    FROM
        date_series ds
    INNER JOIN
        pool_rewards pr
    ON 
        ds.snapshot_date BETWEEN pr.period_start AND pr.period_end
)
SELECT * FROM reward_calculations
ORDER BY snapshot_date, pool_external_id, token_address;
  `);

  const aggregatedData: {
    [key: string]: {
      snapshot_date: Date;
      pool_external_id: string;
      token_address: string;
      network_slug: string;
      rewards: {
        total_supply: string;
        period_start: Date;
        period_end: Date;
        rate: string;
      }[];
    };
  } = {};

  poolRewardsPerDay.forEach((item) => {
    const key = `${item.snapshot_date}_${item.pool_external_id}_${item.token_address}`;
    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        snapshot_date: item.snapshot_date,
        pool_external_id: item.pool_external_id,
        token_address: item.token_address,
        network_slug: item.network_slug,
        rewards: [],
      };
    }

    aggregatedData[key].rewards.push({
      total_supply: item.total_supply,
      period_start: item.period_start,
      period_end: item.period_end,
      rate: item.rate,
    });
  });

  const insertData = Object.values(aggregatedData).flatMap((item) => {
    const endOfTheDay = new Date(item.snapshot_date);
    endOfTheDay.setUTCHours(23, 59, 59, 999);
    let totalAmount = 0;

    item.rewards.forEach((reward) => {
      // const start = Math.max(
      //   item.snapshot_date.getTime(),
      //   reward.period_start.getTime(),
      // );
      // const end = Math.min(endOfTheDay.getTime(), reward.period_end.getTime());
      // const durationInSeconds = (end - start) / 1000;
      // const annualScalingFactor = SECONDS_IN_YEAR / durationInSeconds;
      const amount = Number(reward.rate) * SECONDS_IN_YEAR;
      totalAmount += amount;
    });

    return [
      {
        timestamp: item.snapshot_date,
        poolExternalId: item.pool_external_id,
        tokenAddress: item.token_address,
        totalSupply: item.rewards[0].total_supply,
        yearlyAmount: String(totalAmount),
        externalId: `${item.pool_external_id}-${
          item.token_address
        }-${item.snapshot_date.toISOString()}`,
      },
    ];
  });

  if (insertData.length > 0)
    return await addToTable(poolRewardsSnapshot, insertData);

  logIfVerbose("Calculating pool rewards snapshots done");
}
