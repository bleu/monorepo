import { NextRequest, NextResponse } from "next/server";

import { getBALPriceByRound } from "#/app/apr/(utils)/getBALPriceByRound";
import { Round } from "#/app/apr/(utils)/rounds";
import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";

// import { DuneAPI } from "#/lib/dune";
import { mockGetTVLByRoundId, voteGaugeByID } from "../../mock_apis";

export async function GET(
  request: NextRequest,
  context: { params: { roundId: number } },
) {
  if (!context.params.roundId) return "Missing round_id";
  const selectedRound = Round.getRoundByNumber(context.params.roundId);

  // const duneAPI = new DuneAPI();
  // const requestJson = await duneAPI.getPoolsByRoundId(context.params.roundId)
  const requestJson = voteGaugeByID.filter((gauge) => {
    const poolIdFilter = request.nextUrl.searchParams.get("poolid");
    if (!poolIdFilter) return true;

    const filterGaugeAddr = new Pool(poolIdFilter).gauge?.address;

    return gauge["symbol"] === filterGaugeAddr;
  });

  // const totalTVLRequest = await duneAPI.getTVLByRoundId(context.params.roundId)
  const totalTVLRequest = mockGetTVLByRoundId;
  const totalTvl = totalTVLRequest[0]["total_tvl"];

  const balPrice = await getBALPriceByRound(selectedRound);

  const balWeeklyEmissions = balEmissions.weekly(
    Math.round(new Date().getTime() / 1000),
  );

  requestJson.forEach((poolData) => {
    // APR = emissions in week * voting share * weeks in year * BAL price / TVL
    // @ts-ignore
    poolData["apr"] =
      (balWeeklyEmissions * poolData.pct_votes * 52 * balPrice) /
      totalTvl /
      100;
    return poolData;
  });
  return NextResponse.json(requestJson);
}
