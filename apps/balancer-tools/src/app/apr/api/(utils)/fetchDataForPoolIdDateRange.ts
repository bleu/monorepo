/* eslint-disable no-console */
import { Pool } from "#/lib/balancer/gauges";

import {
  calculatePoolData,
  calculatePoolStats,
} from "../../(utils)/calculatePoolStats";
import { computeAverages } from "./computeAverages";
import { formatDateToMMDDYYYY, generateDateRange } from "./date";

const MAX_RETRIES = 3; // specify the number of retry attempts
const RETRY_DELAY = 1000; // delay between retries in milliseconds

export async function fetchDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
) {
  const startDateOrPoolAddedDate =
    startDate < new Date(new Pool(poolId).createdAt * 1000)
      ? new Date(new Pool(poolId).createdAt * 1000)
      : startDate;

  const allDaysBetween = generateDateRange(startDateOrPoolAddedDate, endDate);
  const perDayData: { [key: string]: calculatePoolData[] } = {};

  for (const dayDate of allDaysBetween) {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      try {
        const data = await calculatePoolStats({
          startAtTimestamp:
            new Date(dayDate.getTime() - 24 * 60 * 60 * 1000).getTime() / 1000,
          endAtTimestamp: dayDate.getTime() / 1000,
          poolId,
        });
        perDayData[formatDateToMMDDYYYY(dayDate)] = [data] || [];
        break;
      } catch (error) {
        attempts++;
        console.error(
          `Attempt ${attempts} - Error fetching data for pool ${poolId} and date ${formatDateToMMDDYYYY(
            dayDate,
          )}}:`,
          error,
        );

        if (attempts >= MAX_RETRIES) {
          // TODO: BAL-782 - Add sentry here
          console.error("Max retries reached. Giving up fetching data.");
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  return {
    perDay: perDayData,
    average: computeAverages(perDayData),
  };
}
