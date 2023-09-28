import { Pool } from "#/lib/balancer/gauges";

import {
  calculatePoolData,
  calculatePoolStats,
} from "../../(utils)/calculatePoolStats";
import { computeAverages } from "./computeAverages";
import {
  dateToEpoch,
  formatDateToMMDDYYYY,
  generateDateRange,
  SECONDS_IN_DAY,
} from "./date";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getStartDateOrPoolAddedDate = (startDate: Date, poolId: string) => {
  const poolAddedDate = new Date(new Pool(poolId).gauge.addedTimestamp * 1000);
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
  const perDayData: { [key: string]: calculatePoolData[] } = {};

  const fetchPromises = allDaysBetween.map(async (dayDate) => {
    const data = await retryAsyncOperation(
      async () => {
        const startAtTimestamp = Math.floor(dayDate - SECONDS_IN_DAY);
        const endAtTimestamp = Math.floor(dayDate);
        return await calculatePoolStats({
          startAtTimestamp,
          endAtTimestamp,
          poolId,
        });
      },
      MAX_RETRIES,
      RETRY_DELAY,
    );

    if (data) {
      perDayData[formatDateToMMDDYYYY(new Date(dayDate * 1000))] = [data];
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

  return {
    perDay: perDayData,
    average: computeAverages(perDayData),
  };
}
