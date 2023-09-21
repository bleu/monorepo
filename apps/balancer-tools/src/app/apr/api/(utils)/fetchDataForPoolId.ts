/* eslint-disable no-console */
import { Pool } from "#/lib/balancer/gauges";
import { fetcher } from "#/utils/fetcher";

import { Round } from "../../(utils)/rounds";
import { BASE_URL } from "../../(utils)/types";
import { PoolStatsResults } from "../route";
import { formatDateToMMDDYYYY } from "./date";

export async function fetchDataForPoolId(poolId: string) {
  const pool = new Pool(poolId);
  const gaugeAddedDate = new Date(pool.gauge.addedTimestamp * 1000);
  const roundGaugeAddedStartDate =
    Round.getRoundByDate(gaugeAddedDate).startDate;
  const formattedStartDate = formatDateToMMDDYYYY(roundGaugeAddedStartDate);
  const formattedEndDate = formatDateToMMDDYYYY(new Date());

  try {
    const gaugesData = await fetcher<PoolStatsResults>(
      `${BASE_URL}/apr/api?startAt=${formattedStartDate}&endAt=${formattedEndDate}&poolId=${poolId}`,
    );
    return gaugesData.perDay;
  } catch (error) {
    // TODO: BAL-782 - Add sentry here
    console.error("Error fetching data:", { poolId, error });
    return {};
  }
}
