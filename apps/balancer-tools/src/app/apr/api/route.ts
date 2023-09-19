/* eslint-disable no-console */
import { NextRequest, NextResponse } from "next/server";

import { getDataFromCacheOrCompute } from "#/lib/cache";

import { PoolTypeEnum } from "../(utils)/calculatePoolStats";
import { fetchDataForPoolId } from "./(utils)/fetchDataForPoolId";
import { fetchDataForPoolIdDateRange } from "./(utils)/fetchDataForPoolIdDateRange";
import { fetchDataForDateRange } from "./(utils)/fetchForDateRange";
import { filterPoolStats } from "./(utils)/filter";
import { sortAndLimit } from "./(utils)/sort";
import { QueryParamsSchema } from "./(utils)/validate";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export interface tokenAPR {
  address: string;
  symbol: string;
  yield: number;
}
export interface PoolTokens {
  percentageValue?: number;
  price?: number;
  address: string;
  logoSrc: string;
  symbol: string;
  weight: string | null;
  balance?: number;
}

export interface PoolStats {
  apr: {
    total: number;
    breakdown: {
      veBAL: number;
      swapFee: number;
      tokens: {
        total: number;
        breakdown: tokenAPR[];
      };
    };
  };
  balPriceUSD: number;
  volume: number;
  tvl: number;
  votingShare: number;
  collectedFeesUSD: number;
}

export type PoolStatsWithoutVotingShareAndCollectedFees = Omit<
  PoolStats,
  "votingShare" | "collectedFeesUSD"
>;

export interface PoolStatsData extends PoolStats {
  symbol: string;
  network: string;
  poolId: string;
  roundId: number;
  tokens: PoolTokens[];
  type: keyof typeof PoolTypeEnum;
}

export interface PoolStatsResults {
  perDay: { [key: string]: PoolStatsData[] };
  average: PoolStatsWithoutVotingShareAndCollectedFees;
}

function valuesFromSearchParams(searchParams: URLSearchParams) {
  return Array.from(searchParams.keys()).reduce(
    (values, key) => ({
      ...values,
      [key]: searchParams.getAll(key)[0],
    }),
    {} as Record<string, Array<string> | string>,
  );
}

export function parseParamToDate(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Use 'dd-mm-yyyy'.");
  }

  const [month, day, year] = parts.map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error("Invalid date format. Use 'dd-mm-yyyy'.");
  }

  // Ensure that the year is four digits
  if (year < 1000 || year > 9999) {
    throw new Error("Invalid year. Use a four-digit year (yyyy).");
  }

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date.");
  }

  return date;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsedParams = QueryParamsSchema.safeParse(
    valuesFromSearchParams(searchParams),
  );

  if (!parsedParams.success) {
    console.log(searchParams);

    return NextResponse.json(
      { error: "Invalid query parameters", details: parsedParams.error.issues },
      { status: 400 },
    );
  }

  const {
    poolId,
    startAt,
    endAt,
    sort = "apr",
    order = "desc",
    limit = Infinity,
    offset = 0,
  } = parsedParams.data;
  let responseData;

  if (poolId && startAt && endAt) {
    return NextResponse.json(
      await getDataFromCacheOrCompute(
        `pool_${poolId}_round_${startAt}_${endAt}`,
        async () => fetchDataForPoolIdDateRange(poolId, startAt, endAt),
      ),
    );
  } else if (poolId) {
    responseData = await getDataFromCacheOrCompute(
      `fetch_pool_id_${poolId}`,
      async () => fetchDataForPoolId(poolId),
    );
  } else if (startAt && endAt) {
    responseData = await getDataFromCacheOrCompute(
      `fetch_round_id_${startAt}_${endAt}`,
      async () => fetchDataForDateRange(startAt, endAt),
    );
  }

  if (responseData === null || !responseData) {
    return NextResponse.json(
      { error: "error fetching data", poolId, startAt, endAt },
      { status: 400 },
    );
  }

  return NextResponse.json(
    sortAndLimit(
      // @ts-ignore
      filterPoolStats(responseData, searchParams),
      // @ts-ignore
      sort,
      order,
      offset,
      limit,
    ),
  );
}
