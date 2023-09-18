/* eslint-disable no-console */
import { NextRequest, NextResponse } from "next/server";

import { Pool, POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";
import { getDataFromCacheOrCompute } from "#/lib/cache";
import { fetcher } from "#/utils/fetcher";

import {
  calculatePoolData,
  calculatePoolStats,
  PoolTypeEnum,
} from "../(utils)/calculatePoolStats";
import { Round } from "../(utils)/rounds";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

type Order = "asc" | "desc";

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

type PoolStatsWithoutVotingShareAndCollectedFees = Omit<
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

const computeAverages = (formattedPoolData: {
  [key: string]: calculatePoolData[];
}): PoolStatsWithoutVotingShareAndCollectedFees => {
  const averages: PoolStatsWithoutVotingShareAndCollectedFees = {
    apr: {
      total: 0,
      breakdown: {
        veBAL: 0,
        swapFee: 0,
        //TODO: on #BAL-795 get tokenAPR from total
        tokens: {
          total: 0,
          breakdown: [],
        },
      },
    },
    balPriceUSD: 0,
    tvl: 0,
    volume: 0,
  };

  let totalDataCount = 0;
  const uniqueEntries: { [key: string]: { idx: number; occorencies: number } } =
    {};

  for (const key in formattedPoolData) {
    if (Object.hasOwnProperty.call(formattedPoolData, key)) {
      const dataArr = formattedPoolData[key];
      dataArr.forEach((data) => {
        averages.apr.total += data.apr.total;
        averages.apr.breakdown.veBAL += data.apr.breakdown.veBAL || 0;
        averages.apr.breakdown.swapFee += data.apr.breakdown.swapFee;
        averages.apr.breakdown.tokens.total +=
          data.apr.breakdown.tokens.total || 0;

        data.apr.breakdown.tokens.breakdown.map((tokenData) => {
          if (!uniqueEntries[tokenData.symbol]) {
            uniqueEntries[tokenData.symbol] = {
              idx: averages.apr.breakdown.tokens.breakdown.length,
              occorencies: 0,
            };
            averages.apr.breakdown.tokens.breakdown.push(tokenData);
          } else {
            uniqueEntries[tokenData.symbol].occorencies++;
            averages.apr.breakdown.tokens.breakdown[
              uniqueEntries[tokenData.symbol].idx
            ].yield += tokenData.yield;
          }
        });

        averages.balPriceUSD += data.balPriceUSD;
        averages.tvl += data.tvl;
        averages.volume += data.volume;
        totalDataCount++;
      });
    }
  }

  if (totalDataCount > 0) {
    averages.apr.total /= totalDataCount;
    averages.apr.breakdown.veBAL /= totalDataCount;
    averages.apr.breakdown.swapFee /= totalDataCount;
    averages.balPriceUSD /= totalDataCount;
    averages.tvl /= totalDataCount;
    averages.volume /= totalDataCount;
    averages.apr.breakdown.tokens.breakdown.map((tokenData) => {
      return {
        ...tokenData,
        yield: tokenData.yield / uniqueEntries[tokenData.symbol].occorencies,
      };
    });
  }

  return averages;
};

async function fetchDataForPoolId(poolId: string): Promise<PoolStatsResults> {
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
    return {
      perDay: gaugesData.perDay,
      average: computeAverages(gaugesData.perDay),
    };
  } catch (error) {
    // TODO: BAL-782 - Add sentry here
    console.error("Error fetching data:", error);
    return {
      perDay: {},
      average: {
        apr: {
          total: 0,
          breakdown: {
            veBAL: 0,
            swapFee: 0,
            tokens: {
              total: 0,
              breakdown: [],
            },
          },
        },
        balPriceUSD: 0,
        volume: 0,
        tvl: 0,
      },
    };
  }
}

const MAX_RETRIES = 3; // specify the number of retry attempts
const RETRY_DELAY = 1000; // delay between retries in milliseconds

async function fetchDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
) {
  const allDaysBetween = generateDateRange(startDate, endDate);
  const perDayData: { [key: string]: calculatePoolData[] } = {};

  for (const dayDate of allDaysBetween) {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      try {
        const currentRound = Round.getRoundByDate(dayDate);
        const data = await calculatePoolStats({ round: currentRound, poolId });
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

const generateDateRange = (startDate: Date, endDate: Date) => {
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const dateRange = [];

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate = new Date(currentDate.getTime() + dayMilliseconds)
  ) {
    dateRange.push(currentDate);
  }

  return dateRange;
};

async function fetchDataForDateRange(
  startDate: Date,
  endDate: Date,
): Promise<PoolStatsResults> {
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

  return {
    perDay: perDayData,
    average: computeAverages(perDayData),
  };
}

function validateSearchParams(
  poolId: string | null,
  startAt: string | null,
  endAt: string | null,
) {
  if (!poolId && (!startAt || startAt === null) && (!endAt || endAt === null)) {
    throw new Error(
      `${startAt ? "" : "startAt"} ${startAt && endAt ? "" : "and"}${
        endAt ? "" : "endAt"
      } ${endAt ? "" : "endAt"} are required`,
    );
  }
  if (poolId) {
    if (
      !POOLS_WITH_LIVE_GAUGES.find(
        (g) => g.id.toLowerCase() === poolId.toLowerCase(),
      )
    ) {
      throw new Error(`Pool with ID ${poolId} not found`);
    }
  }

  if (startAt && endAt) {
    const currentDate = new Date();
    // Defining min date as before bal creation
    const minDate = new Date("2020-01-01");
    const startDate = parseParamToDate(startAt);
    const endDate = parseParamToDate(endAt);

    if (startDate < minDate) {
      throw new Error(
        "Start date is before the minimum allowed date (January 1, 2020).",
      );
    }

    if (endDate > currentDate) {
      throw new Error(
        "End date is in the future. Please provide an end date before today.",
      );
    }
  }
}

function parseParamToDate(dateStr: string) {
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

function formatDateToMMDDYYYY(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month since it's 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}-${day}-${year}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const poolId = searchParams.get("poolId");
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");
  const sort = (searchParams.get("sort") as keyof PoolStatsData) || "apr";
  const order = (searchParams.get("order") as Order) || "desc";
  const limit = parseInt(searchParams.get("limit") ?? "0") || Infinity;
  const offset = parseInt(searchParams.get("offset") ?? "0");
  let responseData;

  try {
    validateSearchParams(poolId, startAt, endAt);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }

  if (poolId && startAt && endAt) {
    const startAtDate = parseParamToDate(startAt as string);
    const endAtDate = parseParamToDate(endAt as string);
    return NextResponse.json(
      await getDataFromCacheOrCompute(
        `pool_${poolId}_round_${startAt}_${endAt}`,
        async () => fetchDataForPoolIdDateRange(poolId, startAtDate, endAtDate),
      ),
    );
  } else if (poolId) {
    responseData = await getDataFromCacheOrCompute(
      `fetch_pool_id_${poolId}`,
      async () => fetchDataForPoolId(poolId),
    );
  } else if (startAt && endAt) {
    const startAtDate = parseParamToDate(startAt as string);
    const endAtDate = parseParamToDate(endAt as string);
    responseData = await getDataFromCacheOrCompute(
      `fetch_round_id_${startAt}_${endAt}`,
      async () => fetchDataForDateRange(startAtDate, endAtDate),
    );
  }

  if (responseData === null || !responseData) {
    return NextResponse.json({ error: "error fetching data" }, { status: 400 });
  }

  return NextResponse.json(
    sortAndLimit(
      // @ts-ignore
      filterPoolStats(responseData, searchParams),
      sort,
      order,
      offset,
      limit,
    ),
  );
}

function filterPoolStats(
  poolStats: PoolStatsResults,
  searchParams: URLSearchParams,
) {
  const perDay = poolStats.perDay;
  const filteredData: { [key: string]: PoolStatsData | PoolStatsData[] } = {};

  for (const date in perDay) {
    const poolOnDate = perDay[date];

    if (Array.isArray(poolOnDate)) {
      filteredData[date] = poolOnDate.filter((pool) =>
        shouldIncludePool(pool, searchParams),
      );
    } else if (shouldIncludePool(poolOnDate, searchParams)) {
      filteredData[date] = poolOnDate;
    }
  }

  return { ...poolStats, perDay: filteredData };
}

function shouldIncludePool(pool: PoolStatsData, searchParams: URLSearchParams) {
  const network = searchParams.get("network");
  const minApr = parseFloat(searchParams.get("minApr") ?? "0");
  const maxApr = parseFloat(searchParams.get("maxApr") ?? "Infinity");
  const minVotingShare = parseFloat(searchParams.get("minVotingShare") ?? "0");
  const maxVotingShare = parseFloat(
    searchParams.get("maxVotingShare") ?? "Infinity",
  );
  const tokenSymbol = searchParams.get("tokens");
  const poolTypes = searchParams.get("types");
  const minTvl = parseFloat(searchParams.get("minTvl") ?? "0");
  const maxTvl = parseFloat(searchParams.get("maxTvl") ?? "Infinity");
  const decodedTokenSymbols = tokenSymbol
    ? tokenSymbol
        .split(",")
        .map((type) => decodeURIComponent(type).toLowerCase())
    : [];

  const decodedPoolTypes = poolTypes
    ? poolTypes.split(",").map((value) =>
        Object.keys(PoolTypeEnum).find(
          // @ts-ignore
          (key) => PoolTypeEnum[key].toLowerCase() === value.toLowerCase(),
        ),
      )
    : [];

  return (
    (!network || pool.network === network) &&
    pool.apr.total >= minApr &&
    pool.apr.total <= maxApr &&
    pool.votingShare * 100 >= minVotingShare &&
    pool.votingShare * 100 <= maxVotingShare &&
    (!tokenSymbol ||
      pool.tokens.some((token) =>
        decodedTokenSymbols.includes(token.symbol.toLowerCase()),
      )) &&
    (!poolTypes || decodedPoolTypes.includes(pool.type.toLowerCase())) &&
    pool.tvl >= minTvl &&
    pool.tvl <= maxTvl
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
  poolStatsResults: PoolStatsResults,
  sortProperty: keyof PoolStatsData = "apr",
  order: Order = "desc",
  offset: number = 0,
  limit: number = Infinity,
): PoolStatsResults {
  const sortedData: Record<string, PoolStatsData[]> = {};

  for (const date in poolStatsResults.perDay) {
    const dayData = poolStatsResults.perDay[date];

    const sortedEntries = dayData
      .sort((a, b) => {
        const valueA = a[sortProperty];
        const valueB = b[sortProperty];

        if (valueA == null || Number.isNaN(valueA)) return 1;
        if (valueB == null || Number.isNaN(valueB)) return -1;

        if (typeof valueA === "number" && typeof valueB === "number") {
          return compareNumbers(valueA, valueB, order);
        } else {
          return compareStrings(valueA.toString(), valueB.toString(), order);
        }
      })
      .slice(offset, offset + limit);

    sortedData[date] = sortedEntries;
  }

  return {
    ...poolStatsResults,
    perDay: sortedData,
  };
}
