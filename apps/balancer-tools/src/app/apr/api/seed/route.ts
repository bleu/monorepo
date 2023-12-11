/* eslint-disable no-console */

import { runDailyETLs } from "@bleu-fi/balancer-apr/src/dailySeed";
import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Start the ETL process asynchronously
  runDailyETLs()
    .then(() => {
      console.log("Seed finished");
    })
    .catch((error) => {
      console.error("Seed encountered an error:", error);
    });

  return Response.json({ message: "Seed is being done" });
}
