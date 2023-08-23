import { NextRequest, NextResponse } from "next/server";

import votingGauges from "#/data/voting-gauges.json";

import { calculatePoolStats } from "../(utils)/calculatePoolStats";
import { Round } from "../(utils)/rounds";

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

function sortingPoolStats(
  PoolStatsResults: { [key: string]: PoolStatsData },
  sortProperty: keyof PoolStatsData,
  orderArg: string = "desc",
  offset: number = 0,
  limit: number = Infinity,
) {
  const sortedEntries = Object.entries(PoolStatsResults)
    .sort((a, b) => {
      if (!a[1] || !b[1]) return 0;
      const valueA = a[1][sortProperty];
      const valueB = b[1][sortProperty];

      // Handle Numbers
      if (typeof valueA === "number" && typeof valueB === "number") {
        // Handle null values
        if (valueB === null || (isNaN(valueA) && isNaN(valueB))) return 0;
        if (isNaN(valueA)) return 1;
        if (isNaN(valueB)) return -1;

        return orderArg === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Handle null values
      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return 1;
      if (valueB === null) return -1;

      // Handle Strings
      return orderArg === "asc"
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    })
    .slice(offset, offset + limit);
  return Object.fromEntries(sortedEntries);
}

export async function GET(request: NextRequest) {
  const poolId = request.nextUrl.searchParams.get("poolid");
  const roundId = request.nextUrl.searchParams.get("roundid");
  const sortArg: keyof PoolStatsData = request.nextUrl.searchParams.get("sort");
  const orderArg = request.nextUrl.searchParams.get("order") || undefined;
  const limitArg =
    parseInt(request.nextUrl.searchParams.get("limit") ?? "0") || Infinity;
  const offsetArg = parseInt(request.nextUrl.searchParams.get("offset") ?? "0");

  // If it has no poolId or roundId, return an error
  if (!roundId && !poolId) {
    return NextResponse.json({ error: "no roundId or poolId provided" });
  }

  // If it has a poolId but no roundId, return the average of all rounds and per round
  if (poolId) {
    const gauge = votingGauges.filter((gauge) => gauge.id === poolId)[0];
    // Multiplying by 1000 because unix timestamp is in seconds
    const gaugeAddedDate = new Date(gauge["addedTimestamp"] * 1000);
    const roundGaugeAdded = Round.getRoundByDate(gaugeAddedDate);

    const results: PoolStatsData[] = await Promise.all(
      Array.from(
        {
          length:
            parseInt(Round.currentRound().value) -
            parseInt(roundGaugeAdded.value),
        },
        (_, index) =>
          calculatePoolStats({
            poolId: poolId,
            roundId: String(index + parseInt(roundGaugeAdded.value)),
          }),
      ),
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
      { apr: 0, balPriceUSD: 0, tvl: 0, votingShare: 0 },
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
      {} as { [key: number]: PoolStatsData },
    );

    return NextResponse.json({ perRound, average: averageResult });
  }

  // If it has a roundId but no poolId, return all pools for that round
  if (roundId && !poolId) {
    const validGaugesList = votingGauges
      .filter((gauge) => !gauge.gauge.isKilled)
      .map((gauge) => gauge.id);

    const gaguesData = await Promise.allSettled(
      validGaugesList.map((poolId) => calculatePoolStats({ poolId, roundId })),
    );

    // This should handle case where a pool returns nothing for that round
    const resolvedGaugesData = gaguesData
      .filter((result) => result.status === "fulfilled")
      .map((result) => {
        if (result.status === "fulfilled") {
          // This if is here because TS can't infer only fufilled results are in the array
          return result.value;
        }
      });

    const parsedResult = validGaugesList.reduce((acc, poolId, index) => {
      acc[poolId] = resolvedGaugesData[index];
      return acc;
    }, {});

    if (sortArg) {
      return NextResponse.json(
        sortingPoolStats(parsedResult, sortArg, orderArg, offsetArg, limitArg),
      );
    }
    if (limitArg) {
      const limitedData = Object.keys(parsedResult)
        .slice(offsetArg, offsetArg + limitArg)
        .reduce((acc, key) => {
          acc[key] = parsedResult[key];
          return acc;
        }, {});
      return NextResponse.json(limitedData);
    }

    return NextResponse.json(parsedResult);
  }

  // If it has a poolId and a roundId, return the stats for that pool and round
  if (roundId && poolId) {
    const poolStats = await calculatePoolStats({ roundId, poolId });
    return NextResponse.json(poolStats);
  }
}
