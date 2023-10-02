/* eslint-disable no-console */

// @ts-ignore: TS2307
import * as Sentry from "@sentry/nextjs";
// @ts-ignore: TS2307
import pLimit from "p-limit";

import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";
import { fetcher } from "#/utils/fetcher";

import { BASE_URL } from "../../(utils)/types";
import { PoolStatsData, PoolStatsResults } from "../route";
import { formatDateToMMDDYYYY } from "./date";

// Create a p-limit instance with a concurrency limit of 1
const limit = pLimit(55);

export async function fetchDataForDateRange(
  startDate: Date,
  endDate: Date,
): Promise<{ [key: string]: PoolStatsData[] }> {
  const perDayData: { [key: string]: PoolStatsData[] } = {};

  await Promise.all(
    POOLS_WITH_LIVE_GAUGES.map(async (pool) => {
      let gaugesData;
      try {
        // Use limit to control concurrency here
        gaugesData = await limit(() => {
          console.log(">> Returned for pool", pool.id);
          return fetcher<PoolStatsResults>(
            `${BASE_URL}/apr/api?startAt=${formatDateToMMDDYYYY(
              startDate,
            )}&endAt=${formatDateToMMDDYYYY(endDate)}&poolId=${pool.id}`,
          );
        });
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
            perDayData[dayStr].push((poolData as PoolStatsData[])[0]);
          } else {
            perDayData[dayStr] = [(poolData as PoolStatsData[])[0]];
          }
        });
      }
    }),
  );
  return perDayData;
}
