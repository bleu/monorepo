import { NextRequest, NextResponse } from "next/server";

import { mockGetTVLByRoundId } from "#/app/apr/mock_apis";
// import { DuneAPI } from "#/lib/dune";

export async function GET(
  _: NextRequest,
  context: { params: { roundId: number } }
) {
  if (!context.params.roundId) return "Missing round_id";
  // const duneAPI = new DuneAPI();
  // const dune_request = await duneAPI.getTVLByRoundId(context.params.roundId)
  const dune_request = mockGetTVLByRoundId;
  return NextResponse.json(dune_request);
}
