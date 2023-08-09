import { NextRequest, NextResponse } from "next/server";

import { DuneAPI } from "#/lib/dune";

export async function GET(
  _: NextRequest,
  context: { params: { roundId: number } },
) {
  if (!context.params.roundId) return "Missing round_id";
  const duneAPI = new DuneAPI();

  const dune_request = await duneAPI.getPoolsByRoundId(context.params.roundId);
  return NextResponse.json(dune_request);
}
