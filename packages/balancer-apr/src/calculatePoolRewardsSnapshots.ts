import {
  DAYS_IN_YEAR,
  SECONDS_IN_DAY,
  SECONDS_IN_YEAR,
} from "@bleu-fi/utils/date";
import { sql } from "drizzle-orm";

import { db } from "./db/index";
import { poolRewardsSnapshot } from "./db/schema";
import { logIfVerbose } from "./index";

export async function calculatePoolRewardsSnapshots() {
  logIfVerbose("Calculating pool rewards snapshots");
  const poolRewardsPerDay = await db.execute(sql`
  WITH date_series AS (
    SELECT generate_series(
        (SELECT MIN(period_start) FROM pool_rewards),
        (SELECT MAX(period_end) FROM pool_rewards),
        interval '1 day'
    )::date AS snapshot_date
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
    JOIN
        pool_rewards pr ON ds.snapshot_date BETWEEN pr.period_start AND pr.period_end
    ORDER BY pr.period_start ASC
)
SELECT * FROM reward_calculations
  `);

  const aggregatedData = {};

  poolRewardsPerDay.forEach((item) => {
    const key = `${item.snapshot_date}_${item.pool_external_id}_${item.token_address}`;
    //@ts-ignore
    if (!aggregatedData[key]) {
      //@ts-ignore
      aggregatedData[key] = {
        snapshot_date: item.snapshot_date,
        pool_external_id: item.pool_external_id,
        token_address: item.token_address,
        network_slug: item.network_slug,
        rewards: [],
      };
    }

    //@ts-ignore
    aggregatedData[key].rewards.push({
      total_supply: item.total_supply,
      period_start: item.period_start,
      period_end: item.period_end,
      rate: item.rate,
    });
  });

  const resultArray: {
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
  }[] = Object.values(aggregatedData);

  const withOneReward = resultArray.filter((item) => item.rewards.length === 1);
  const withTwoRewards = resultArray.filter(
    (item) => item.rewards.length === 2,
  );

  for (const item of withOneReward) {
    const isTimestampBetweenPeriod =
      item.snapshot_date >= item.rewards[0].period_start &&
      item.snapshot_date <= item.rewards[0].period_end;
    if (isTimestampBetweenPeriod) {
      const amount =
        Number(item.rewards[0].rate) * SECONDS_IN_DAY * DAYS_IN_YEAR;
      await db
        .insert(poolRewardsSnapshot)
        .values({
          timestamp: item.snapshot_date,
          poolExternalId: item.pool_external_id,
          tokenAddress: item.token_address,
          totalSupply: item.rewards[0].total_supply,
          yearlyAmount: String(amount),
          externalId: `${item.pool_external_id}-${
            item.token_address
          }-${item.snapshot_date.toISOString()}`,
        })
        .onConflictDoNothing()
        .execute();
    }
  }

  for (const item of withTwoRewards) {
    const arePeriodsOverlapping =
      item.rewards[0].period_end >= item.rewards[1].period_start;

    if (arePeriodsOverlapping) {
      const isTimestampBetweenSecondPeriod =
        item.snapshot_date >= item.rewards[1].period_start &&
        item.snapshot_date <= item.rewards[1].period_end;
      if (isTimestampBetweenSecondPeriod) {
        const amount =
          Number(item.rewards[0].rate) * SECONDS_IN_DAY * DAYS_IN_YEAR;
        await db
          .insert(poolRewardsSnapshot)
          .values({
            timestamp: item.snapshot_date,
            poolExternalId: item.pool_external_id,
            tokenAddress: item.token_address,
            totalSupply: item.rewards[0].total_supply,
            yearlyAmount: String(amount),
            externalId: `${item.pool_external_id}-${
              item.token_address
            }-${item.snapshot_date.toISOString()}`,
          })
          .onConflictDoNothing()
          .execute();
      } else {
        const endOfTheDay = new Date(item.snapshot_date);
        endOfTheDay.setUTCHours(23, 59, 59, 999);
        const firstDuration =
          (item.rewards[1].period_start.getTime() -
            item.snapshot_date.getTime()) /
          1000;
        const firstAnnualScalingFactor = SECONDS_IN_YEAR / firstDuration;
        const secondDuration =
          (endOfTheDay.getTime() - item.rewards[1].period_start.getTime()) /
          1000;
        const secondAnnualScalingFactor = SECONDS_IN_YEAR / secondDuration;
        const firstAmount =
          Number(item.rewards[0].rate) *
          firstDuration *
          firstAnnualScalingFactor;
        const secondAmount =
          Number(item.rewards[1].rate) *
          secondDuration *
          secondAnnualScalingFactor;
        const amount = firstAmount + secondAmount;
        await db
          .insert(poolRewardsSnapshot)
          .values({
            timestamp: item.snapshot_date,
            poolExternalId: item.pool_external_id,
            tokenAddress: item.token_address,
            totalSupply: item.rewards[0].total_supply,
            yearlyAmount: String(amount),
            externalId: `${item.pool_external_id}-${
              item.token_address
            }-${item.snapshot_date.toISOString()}`,
          })
          .onConflictDoNothing()
          .execute();
      }
    } else {
      const endOfTheDay = new Date(item.snapshot_date);
      endOfTheDay.setUTCHours(23, 59, 59, 999);

      const firstDuration =
        (item.rewards[0].period_end.getTime() - item.snapshot_date.getTime()) /
        1000;

      const firstAnnualScalingFactor = SECONDS_IN_YEAR / firstDuration;
      const secondDuration =
        (endOfTheDay.getTime() - item.rewards[1].period_start.getTime()) / 1000;
      const secondAnnualScalingFactor = SECONDS_IN_YEAR / secondDuration;
      const firstAmount =
        Number(item.rewards[0].rate) * firstDuration * firstAnnualScalingFactor;
      const secondAmount =
        Number(item.rewards[1].rate) *
        secondDuration *
        secondAnnualScalingFactor;
      const amount = firstAmount + secondAmount;
      await db
        .insert(poolRewardsSnapshot)
        .values({
          timestamp: item.snapshot_date,
          poolExternalId: item.pool_external_id,
          tokenAddress: item.token_address,
          totalSupply: item.rewards[0].total_supply,
          yearlyAmount: String(amount),
          externalId: `${item.pool_external_id}-${
            item.token_address
          }-${item.snapshot_date.toISOString()}`,
        })
        .onConflictDoNothing()
        .execute();
    }
  }
  logIfVerbose("Calculating pool rewards snapshots done");
}
