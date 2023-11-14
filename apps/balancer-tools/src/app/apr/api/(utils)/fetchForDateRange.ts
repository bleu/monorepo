/* eslint-disable no-console */

import { formatDateToMMDDYYYY } from "@bleu-fi/utils/date";
import * as Sentry from "@sentry/nextjs";
import { sql } from "drizzle-orm";

import { db } from "#/db";
import { fetcher } from "#/utils/fetcher";

import { BASE_URL } from "../../(utils)/types";
import { PoolStatsData, PoolStatsResults } from "../route";

export async function fetchDataForDateRange(
  startDate: Date,
  endDate: Date,
  maxTvl: number = 10_000_000_000,
  minTvl: number = 10_000,
): Promise<{ [key: string]: PoolStatsData[] }> {
  const existingPoolForDate = await db.execute(sql`
    SELECT
      p.external_id AS id,
      p.symbol AS symbol,
      p.pool_type AS pool_type,
      p.network_slug AS network
    FROM
      pool_snapshots ps
      JOIN pools p ON p.external_id = ps.pool_external_id
    WHERE
      ps.timestamp = '${sql.raw(endDate.toISOString())}'
      AND ps.liquidity > ${sql.raw(minTvl.toString())}
      AND ps.liquidity < ${sql.raw(maxTvl.toString())}
  `);
  console.log(`fetched ${existingPoolForDate.length} pools`);
  const perDayData: { [key: string]: PoolStatsData[] } = {};

  await Promise.all(
    existingPoolForDate.map(async (pool) => {
      let gaugesData;
      try {
        gaugesData = await fetcher<PoolStatsResults>(
          `${BASE_URL}/apr/api?startAt=${formatDateToMMDDYYYY(
            startDate,
          )}&endAt=${formatDateToMMDDYYYY(endDate)}&poolId=${pool.id}`,
        );
      } catch (error) {
        console.log(error);
        console.log(
          `${BASE_URL}/apr/api?startAt=${formatDateToMMDDYYYY(
            startDate,
          )}&endAt=${formatDateToMMDDYYYY(endDate)}&poolId=${pool.id}`,
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
