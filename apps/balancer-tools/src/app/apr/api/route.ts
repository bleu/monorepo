/* eslint-disable no-console */
import { NextRequest, NextResponse } from "next/server";

import { PoolTypeEnum } from "../(utils)/types";
import { computeAverages } from "./(utils)/computeAverages";
import { fetchDataForPoolId } from "./(utils)/fetchDataForPoolId";
import { fetchDataForPoolIdDateRange } from "./(utils)/fetchDataForPoolIdDateRange";
import { fetchDataForDateRange } from "./(utils)/fetchForDateRange";
import { filterPoolStats } from "./(utils)/filter";
import { limitPoolStats, Order, sortPoolStats } from "./(utils)/sort";
import { QueryParamsSchema } from "./(utils)/validate";

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
  weight: number | null;
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

export interface PoolStatsData extends PoolStats {
  symbol: string;
  network: string;
  poolId: string;
  tokens: PoolTokens[];
  type: keyof typeof PoolTypeEnum;
}

export interface PoolStatsResults {
  perDay: { [key: string]: PoolStatsData[] };
  average: { poolAverage: PoolStatsData[] };
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
      await fetchDataForPoolIdDateRange(poolId, startAt, endAt),
    );
  } else if (poolId) {
    responseData = await fetchDataForPoolId(poolId);
  } else if (startAt && endAt) {
    responseData = await fetchDataForDateRange(startAt, endAt);
  }

  if (responseData === null || !responseData) {
    return NextResponse.json(
      { error: "error fetching data", poolId, startAt, endAt },
      { status: 400 },
    );
  }

  const filteredRespondeData = limitPoolStats(
    filterPoolStats(responseData, searchParams),
    offset,
    limit,
  );

  return NextResponse.json(
    sortPoolStats(
      {
        perDay: filteredRespondeData,
        average: computeAverages(filteredRespondeData),
      },
      sort as keyof PoolStatsData | undefined,
      order as Order | undefined,
    ),
  );
}
