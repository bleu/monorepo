/* eslint-disable no-console */

import { formatDateToMMDDYYYY } from "@bleu-fi/utils/date";
import * as Sentry from "@sentry/nextjs";
import { and, between, eq } from "drizzle-orm";

import { db } from "#/db";
import { pools, poolSnapshots } from "#/db/schema";
import { fetcher } from "#/utils/fetcher";

import { BASE_URL } from "../../(utils)/types";
import { PoolStatsData, PoolStatsResults } from "../route";

export async function fetchDataForDateRange(
  startDate: Date,
  endDate: Date,
  maxTvl: number = 10_000_000_000,
  minTvl: number = 10_000,
): Promise<{ [key: string]: PoolStatsData[] }> {
  const existingPoolForDate = await db
    .select({
      id: pools.id,
      poolExternalId: pools.externalId,
      symbol: pools.symbol,
      poolType: pools.poolType,
      network: pools.networkSlug,
    })
    .from(pools)
    .fullJoin(poolSnapshots, eq(poolSnapshots.poolExternalId, pools.externalId))
    .where(
      and(
        eq(poolSnapshots.timestamp, endDate),
        between(poolSnapshots.liquidity, String(minTvl), String(maxTvl)),
      ),
    );

  console.log(`fetched ${existingPoolForDate.length} pools`);
  const perDayData: { [key: string]: PoolStatsData[] } = {};

  await Promise.all(
    existingPoolForDate.map(async (pool) => {
      let gaugesData;
      try {
        gaugesData = await fetcher<PoolStatsResults>(
          `${BASE_URL}/apr/api?startAt=${formatDateToMMDDYYYY(
            startDate,
          )}&endAt=${formatDateToMMDDYYYY(endDate)}&poolId=${
            pool.poolExternalId
          }`,
        );
      } catch (error) {
        console.log(error);
        console.log(
          `${BASE_URL}/apr/api?startAt=${formatDateToMMDDYYYY(
            startDate,
          )}&endAt=${formatDateToMMDDYYYY(endDate)}&poolId=${
            pool.poolExternalId
          }`,
        );
        Sentry.captureException(error);
      }

      if (gaugesData) {
        Object.entries(gaugesData.perDay).forEach(([dayStr, poolData]) => {
          if (perDayData[dayStr]) {
            perDayData[dayStr].push(poolData[0]);
          } else {
            perDayData[dayStr] = [poolData[0]];
          }
        });
      }
    }),
  );
  return perDayData;
}
