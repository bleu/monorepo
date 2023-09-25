/* eslint-disable no-console */
import { Pool } from "#/lib/balancer/gauges";
import { fetcher } from "#/utils/fetcher";

import { BASE_URL } from "../../(utils)/types";
import { PoolStatsResults } from "../route";
import { formatDateToMMDDYYYY } from "./date";

export async function fetchDataForPoolId(poolId: string) {
  const pool = new Pool(poolId);
  const gaugeAddedDate = new Date(pool.gauge.addedTimestamp * 1000);
  const formattedStartDate = formatDateToMMDDYYYY(gaugeAddedDate);
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
