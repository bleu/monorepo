import { NextRequest, NextResponse } from "next/server";

import { getBalEmissions } from "#/app/apr/(utils)/getBalEmission";
import { getBALPriceByRound } from "#/app/apr/(utils)/getBALPriceByRound";
import { Round } from "#/app/apr/(utils)/rounds";

// import { DuneAPI } from "#/lib/dune";
import { mockGetTVLByRoundId, voteGaugeByID } from "../../mock_apis";

export async function GET(
  _: NextRequest,
  context: { params: { roundId: number } }
) {
  if (!context.params.roundId) return "Missing round_id";
  const selectedRound = Round.getRoundByNumber(context.params.roundId);

  // const duneAPI = new DuneAPI();
  // const requestJson = await duneAPI.getPoolsByRoundId(context.params.roundId)
  const requestJson = voteGaugeByID;

  // const totalTVLRequest = await duneAPI.getTVLByRoundId(context.params.roundId)
  const totalTVLRequest = mockGetTVLByRoundId;
  const totalTvl = totalTVLRequest[0]["total_tvl"];

  const balPrice = await getBALPriceByRound(selectedRound);
  const balWeeklyEmissions = getBalEmissions(
    selectedRound.endDate.getFullYear()
  )["weekly"];

  requestJson.forEach((poolData) => {
    // APR = emissions in week * voting share * weeks in year * BAL price / TVL
    poolData["apr"] =
      (balWeeklyEmissions * poolData.pct_votes * 52 * balPrice) /
      totalTvl /
      100;
    return poolData;
  });
  return NextResponse.json(requestJson);
}
