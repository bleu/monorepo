import { NextRequest, NextResponse } from "next/server";

import votingGauges from "#/data/voting-gauges.json";

import { calculatePoolStats } from "../(utils)/calculatePoolStats";
import { Round } from "../(utils)/rounds";

function sortingPoolStats(PoolStatsResults: {[key: string]: PoolStatsData}, sortProperty: string, orderArg: string  = 'desc', limit: number = Infinity) {
  const sortedEntries = Object.entries(PoolStatsResults).sort((a, b) => {
    if(!a[1] || !b[1]) return 0;
    const valueA = a[1][sortProperty];
    const valueB = b[1][sortProperty];

export interface PoolStatsData {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
  roundId: number;
  symbol: string;
}

function sortingPoolStats(
  PoolStatsResults: { [key: string]: PoolStatsData },
  sortProperty: string,
  orderArg: string = "desc",
  limit: number = Infinity,
) {
  const sortedEntries = Object.entries(PoolStatsResults)
    .sort((a, b) => {
      if (!a[1] || !b[1]) return 0;
      const valueA = a[1][sortProperty];
      const valueB = b[1][sortProperty];

      // Handle null values
      if (
        (valueA === null && valueB === null) ||
        (isNaN(valueA) && isNaN(valueB))
      )
        return 0;
      if (valueA === null || isNaN(valueA)) return 1;
      if (valueB === null || isNaN(valueB)) return -1;

      // Handle Numbers
      if (typeof valueA === "number" && typeof valueB === "number") {
        return orderArg === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Handle Strings
      return orderArg === "asc"
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    })
    .slice(0, limit);
  return Object.fromEntries(sortedEntries);
}

export async function GET(request: NextRequest) {
  const poolId = request.nextUrl.searchParams.get("poolid");
  const roundId = request.nextUrl.searchParams.get("roundid");
  if (!roundId && !poolId) {
    return NextResponse.json({ error: "no round or poolId provided" });
  }

  if (roundId && poolId) {
    const poolStats = await calculatePoolStats({ roundId, poolId });

    return NextResponse.json(poolStats);
  }

  if (poolId) {
    const gauge = votingGauges.filter((gauge) => gauge.pool.id === poolId)[0];
    // Multiplying by 1000 because unix timestamp is in seconds
    const gaugeAddedDate = new Date(gauge["addedTimestamp"] * 1000);
    const roundGaugeAdded = Round.getRoundByDate(gaugeAddedDate);

    const results = await Promise.all(
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

    const perRound = results.map((result, index) => {
      return {
        [parseInt(roundGaugeAdded.value) + index]: result,
      };
    });

    return NextResponse.json({ perRound, average: averageResult });
  }
}
