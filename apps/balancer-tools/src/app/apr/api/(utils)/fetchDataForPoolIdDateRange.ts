import {
  dateToEpoch,
  formatDateToMMDDYYYY,
  generateDateRange,
} from "@bleu-fi/utils/date";

import { Pool } from "#/lib/balancer/gauges";

import {
  calculatePoolData,
  calculatePoolStats,
} from "../../(utils)/calculatePoolStats";
import { computeAverages } from "./computeAverages";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getStartDateOrPoolAddedDate = (startDate: Date, poolId: string) => {
  const poolAddedDate = new Date(new Pool(poolId).createdAt * 1000);
  return startDate < poolAddedDate ? poolAddedDate : startDate;
};

const retryAsyncOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number,
  delay: number,
): Promise<T | null> => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
};

export async function fetchDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
) {
  const startDateOrPoolAddedDate = getStartDateOrPoolAddedDate(
    startDate,
    poolId,
  );
  const allDaysBetween = generateDateRange(
    dateToEpoch(startDateOrPoolAddedDate),
    dateToEpoch(endDate),
  );

  const perDayData: (number | calculatePoolData)[][] = [];

  const fetchPromises = allDaysBetween.map(async (dayDate, dayIdx) => {
    const data = await retryAsyncOperation(
      async () => {
        const endAtTimestamp = Math.floor(dayDate);
        return await calculatePoolStats({
          endAtTimestamp,
          poolId,
        });
      },
      MAX_RETRIES,
      RETRY_DELAY,
    );

    if (data) {
      perDayData.push([dayIdx, data]);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Max retries reached for pool ${poolId} and date ${formatDateToMMDDYYYY(
          new Date(dayDate * 1000),
        )}.`,
      );
    }
  });

  await Promise.all(fetchPromises);

  //TODO: solve this type
  //@ts-ignore
  const orderedPerDayData: { [k: string]: calculatePoolData[] } =
    Object.fromEntries(
      perDayData
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([dayIdx, obj]) => [
          formatDateToMMDDYYYY(new Date(allDaysBetween[Number(dayIdx)] * 1000)),
          [obj],
        ]),
    );

  return {
    perDay: orderedPerDayData,
    average: computeAverages(orderedPerDayData),
  };
}
