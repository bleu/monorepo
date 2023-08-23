import { NextRequest, NextResponse } from "next/server";

import votingGauges from "#/data/voting-gauges.json";

import { calculatePoolStats } from "../(utils)/calculatePoolStats";
import { Round } from "../(utils)/rounds";

type Order = "asc" | "desc";

export interface PoolStatsData {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
  symbol: string;
  network: string;
}

export interface RoundStatsResults {
  [roundId: string]: PoolStatsData;
}

export interface PoolStatsResults {
  perRound: RoundStatsResults;
  average: PoolStatsData;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const memoryCache: { [key: string]: any } = {};

const fetchDataForRoundId = async (roundId: string) => {
  const validGaugesList = votingGauges
    .filter((gauge) => !gauge.gauge.isKilled)
    .map((gauge) => gauge.id);

  const gaugesData = await Promise.allSettled(
    validGaugesList.map(async (poolId) => {
      return await handleBothPoolAndRoundId(poolId, roundId);
    })
  );

  const resolvedGaugesData = gaugesData
    .filter((result) => result.status === "fulfilled")
    .map((result) => result?.value);

  const parsedResult = validGaugesList.reduce((acc, poolId, index) => {
    acc[poolId] = resolvedGaugesData[index];
    return acc;
  }, {});

  return parsedResult;
};

const fetchDataForPoolId = async (poolId: string) => {
  const gauge = votingGauges.filter((gauge) => gauge.id === poolId)[0];
  // Multiplying by 1000 because unix timestamp is in seconds
  const gaugeAddedDate = new Date(gauge.gauge.addedTimestamp * 1000);
  const roundGaugeAdded = Round.getRoundByDate(gaugeAddedDate);

  const results: PoolStatsData[] = await Promise.all(
    Array.from(
      {
        length:
          parseInt(Round.currentRound().value) -
          parseInt(roundGaugeAdded.value),
      },
      async (_, index) => {
        return await handleBothPoolAndRoundId(poolId, String(index + parseInt(roundGaugeAdded.value)));
      }
    )
  );

  const averagedValues = results.reduce(
    (acc, result) => {
      return {
        apr: acc.apr + result.apr,
        balPriceUSD: acc.balPriceUSD + result.balPriceUSD,
        tvl: acc.tvl + result.tvl,
        votingShare: acc.votingShare + result.votingShare,
      };
    },
    { apr: 0, balPriceUSD: 0, tvl: 0, votingShare: 0 }
  );
  const numResults = results.length;
  const averageResult = {
    apr: averagedValues.apr / numResults,
    balPriceUSD: averagedValues.balPriceUSD / numResults,
    tvl: averagedValues.tvl / numResults,
    votingShare: averagedValues.votingShare / numResults,
  };
  const perRound = results.reduce(
    (acc, obj, index) => {
      acc[index + 1 + parseInt(roundGaugeAdded.value)] = obj;
      return acc;
    },
    {} as { [key: number]: PoolStatsData }
  );

  return { perRound, average: averageResult };
};

const getDataFromCacheOrCompute = async (
  cacheKey: string,
  computeFn: () => Promise<any>
) => {
  if (!memoryCache[cacheKey]) {
    memoryCache[cacheKey] = await computeFn();
  }
  return memoryCache[cacheKey];
};

const handlePoolIdOnly = async (poolId: string): Promise<PoolStatsResults> => {
  const cacheKey = `pool_${poolId}`;
  return await getDataFromCacheOrCompute(cacheKey, async () => {
    return fetchDataForPoolId(poolId);
  });
};

const handleRoundIdOnly = async (
  roundId: string
): Promise<{ [key: string]: PoolStatsData }> => {
  const cacheKey = `round_${roundId}`;
  return await getDataFromCacheOrCompute(cacheKey, async () => {
    return fetchDataForRoundId(roundId);
  });
};

const handleBothPoolAndRoundId = async (
  poolId: string,
  roundId: string,
  isRetry: boolean = false
): Promise<PoolStatsData> => {
  const cacheKey = `pool_${poolId}_round_${roundId}`;
  try {
    return await getDataFromCacheOrCompute(cacheKey, async () => {
      return calculatePoolStats({ roundId, poolId });
    });
  } catch (e) {
    if (!isRetry) {
      // eslint-disable-next-line no-console
      console.debug(`Exception on for ${poolId}, retrying... ${e}`)
      await Promise((resolve) => setTimeout(resolve, 300));
      return handleBothPoolAndRoundId(poolId, roundId, true);
    } else {
      // eslint-disable-next-line no-console
      console.error("error", e)
    }
  }

};

export async function GET(request: NextRequest) {
  const {
    searchParams,
  } = request.nextUrl;

  const poolId = searchParams.get("poolid");
  const roundId = searchParams.get("roundid");
  const sortArg = (searchParams.get("sort") as keyof PoolStatsData) || "apr";
  const orderArg = (searchParams.get("order") as Order) || "desc";
  const limitArg = parseInt(searchParams.get("limit") ?? "0") || Infinity;
  const offsetArg = parseInt(searchParams.get("offset") ?? "0");

  let responseData;

  if (poolId && roundId) {
    responseData = await handleBothPoolAndRoundId(poolId, roundId);
  } else if (poolId) {
    responseData = await handlePoolIdOnly(poolId);
  } else if (roundId) {
    responseData = await handleRoundIdOnly(roundId);
  } else {
    return NextResponse.json({ error: "no roundId or poolId provided" });
  }

  return NextResponse.json(
    sortAndLimit(responseData, sortArg, orderArg, offsetArg, limitArg)
  );
}

function compareNumbers(a: number, b: number, order: Order): number {
  // Handle NaN values
  if (isNaN(a) && isNaN(b)) return 0;
  if (isNaN(a)) return 1;
  if (isNaN(b)) return -1;

  return order === "asc" ? a - b : b - a;
}

function compareStrings(a: string, b: string, order: Order): number {
  return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
}

function sortAndLimit(
  PoolStatsResults: { [key: string]: PoolStatsData },
  sortProperty: keyof PoolStatsData = "apr",
  orderArg: Order = "desc",
  offset: number = 0,
  limit: number = Infinity
): { [key: string]: PoolStatsData } {
  if (Object.entries(PoolStatsResults).length != 1) return PoolStatsResults;
  const sortedEntries = Object.entries(PoolStatsResults)
    .sort(([_, aValue], [__, bValue]) => {
      const valueA = aValue[sortProperty];
      const valueB = bValue[sortProperty];

      // Handle null values
      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return 1;
      if (valueB === null) return -1;

      if (typeof valueA === "number" && typeof valueB === "number") {
        return compareNumbers(valueA, valueB, orderArg);
      } else {
        return compareStrings(valueA.toString(), valueB.toString(), orderArg);
      }
    })
    .slice(offset, offset + limit);

  return Object.fromEntries(sortedEntries);
}
