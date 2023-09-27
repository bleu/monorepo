/* eslint-disable no-console */

import POOLS_WITH_LIVE_GAUGES from "#/data/voting-gauges.json";
import { fetcher } from "#/utils/fetcher";

import { BASE_URL } from "../../(utils)/types";
import { PoolStatsData, PoolStatsResults } from "../route";
import { formatDateToMMDDYYYY } from "./date";

export async function fetchDataForDateRange(
  startDate: Date,
  endDate: Date,
): Promise<{ [key: string]: PoolStatsData[] }> {
  const existingPoolForDate = POOLS_WITH_LIVE_GAUGES.reverse().filter(
    ({ gauge: { addedTimestamp } }) =>
      addedTimestamp && addedTimestamp <= endDate.getTime(),
  );
  const perDayData: { [key: string]: PoolStatsData[] } = {};

  await Promise.all(
    existingPoolForDate.map(async (pool) => {
      const gaugesData = await fetcher<PoolStatsResults>(
        `${BASE_URL}/apr/api?startAt=${formatDateToMMDDYYYY(
          startDate,
        )}&endAt=${formatDateToMMDDYYYY(endDate)}&poolId=${pool.id}`,
      );

      Object.entries(gaugesData.perDay).forEach(([dayStr, poolData]) => {
        if (perDayData[dayStr]) {
          perDayData[dayStr].push(poolData[0]);
        } else {
          perDayData[dayStr] = [poolData[0]];
        }
      });
    }),
  );
  return perDayData;
}
