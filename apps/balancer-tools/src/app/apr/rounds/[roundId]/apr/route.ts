import { NextRequest, NextResponse } from "next/server";

import calculateRoundAPR from "#/app/apr/(utils)/calculateRoundAPR";
import { getBALPriceByRound } from "#/app/apr/(utils)/getBALPriceByRound";
import { Round } from "#/app/apr/(utils)/rounds";
import { mockGetTVLByRoundId } from "#/app/apr/mock_apis";
// import { DuneAPI } from "#/lib/dune";

export async function GET(
  request: NextRequest,
  context: { params: { roundId: number } },
) {
  if (!context.params.roundId)
    return NextResponse.json({ error: "Missing round_id" });
  if (!request.nextUrl.searchParams.get("votingShare"))
    return NextResponse.json({ error: "Missing voting share" });

  // const duneAPI = new DuneAPI();
  // const dune_request = await duneAPI.getTVLByRoundId(context.params.roundId)
  const currentRound = Round.getRoundByNumber(context.params.roundId);
  const dune_request = mockGetTVLByRoundId;
  const totalTvl = dune_request[0]["total_tvl"];
  const balPrice = await getBALPriceByRound(currentRound);

  return NextResponse.json({
    apr: calculateRoundAPR(
      currentRound,
      Number(request.nextUrl.searchParams.get("votingShare")),
      totalTvl,
      balPrice,
    ),
    balPrice: balPrice,
    totalTvl: totalTvl,
    ASD: currentRound.endDate.toISOString().slice(0, 10),
  });
}
