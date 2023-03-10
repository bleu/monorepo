import { NextResponse } from "next/server";

import { pinPoolMetadata } from "../../../../domain/poolMetadata";

export async function POST(req: Request) {
  const { metadata } = await req.json();

  const pinned = await pinPoolMetadata(metadata);

  return NextResponse.json(pinned);
}
