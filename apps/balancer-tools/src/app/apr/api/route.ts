import { NextRequest, NextResponse } from "next/server";

import votingGauges from "#/data/voting-gauges.json";

import { calculatePoolStats } from "../(utils)/calculatePoolStats";
import { Round } from "../(utils)/rounds";

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
        { length: parseInt(Round.currentRound().value) - parseInt(roundGaugeAdded.value) },
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
