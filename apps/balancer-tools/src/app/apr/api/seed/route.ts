/* eslint-disable no-console */

import { NextRequest } from "next/server";

export const maxDuration = 300;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  console.log(process.env.DATABASE_URL);

  return Response.json({ message: "Seed is being done" });
}
