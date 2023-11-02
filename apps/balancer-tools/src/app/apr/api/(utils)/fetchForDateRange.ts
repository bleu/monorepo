/* eslint-disable no-console */

import { Network, networkIdFor } from "@bleu-fi/utils";
import * as Sentry from "@sentry/nextjs";

import { withCache } from "#/lib/cache";
import { DefiLlamaAPI } from "#/lib/defillama";
import { poolsWithCache } from "#/lib/gql/server";
import { fetcher } from "#/utils/fetcher";

import { BASE_URL } from "../../(utils)/types";
import { PoolStatsData, PoolStatsResults } from "../route";
import { dateToEpoch, formatDateToMMDDYYYY } from "./date";

const fetchPoolsFromNetwork = async (
  network: string,
  endAt: Date,
  maxTvl = 10_000_000_000,
  minTvl = 10_000,
  skip = 0,
) => {
  const limit = 1_000;

  const createdBefore = dateToEpoch(endAt);

  let block;

  try {
    block = await DefiLlamaAPI.findBlockNumber(network, createdBefore);
  } catch (e) {
    // If this errors out, probably the network didn't exist at that timestamp
    return [];
  }
  let response;
  try {
    //TODO: not cache if createdBefore is today
    response = await poolsWithCache.gql(networkIdFor(network)).APRPools({
      skip,
      createdBefore: createdBefore,
      limit,
      minTvl,
      maxTvl,
      block,
    });
  } catch (e) {
    // If this errors out, probably the subgraph hadn't been deployed yet at this block
    return [];
  }
  let fetchedPools: typeof response.pools;
  console.log(
    `Fetched ${response.pools.length} pools from ${network}(${networkIdFor(
      network,
    )}) for block ${block}`,
  );
  fetchedPools = response.pools;

  if (response.pools.length > limit) {
    fetchedPools = [
      ...fetchedPools,
      ...(await fetchPoolsFromNetwork(
        network,
        endAt,
        maxTvl,
        minTvl,
        skip + limit,
      )),
    ];
  }
  return fetchedPools;
};

const fetchPools = async (
  network: string,
  endDate: Date,
  maxTvl = 10_000_000_000,
  minTvl = 10_000,
) => {
  const networks = network
    ? [network]
    : Object.values(Network).filter(
        (network) => network !== Network.Sepolia && network !== Network.Goerli,
      );
  const allFetchedPools = await Promise.all(
    networks.map(
      async (network) =>
        await fetchPoolsFromNetwork(network, endDate, maxTvl, minTvl),
    ),
  );

  // Flatten the array of arrays into a single array.
  return allFetchedPools.flat();
};
export const fetchDataForDateRange = withCache(
  async function fetchDataForDateRangeFn(
    startDate: Date,
    endDate: Date,
    network: string,
    maxTvl: number = 10_000_000_000,
    minTvl: number = 10_000,
  ): Promise<{ [key: string]: PoolStatsData[] }> {
    const existingPoolForDate = await fetchPools(
      network,
      endDate,
      maxTvl,
      minTvl,
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
  },
);
