/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateToEpoch } from "@bleu-fi/utils/date";
import { and, eq, isNull, sql } from "drizzle-orm";
import pThrottle from "p-throttle";

import { db } from "../../../db/index";
import { blocks, calendar, networks } from "../../../db/schema";
import { addToTable, logIfVerbose } from "../../../index";
import { DefiLlamaAPI } from "../../../lib/defillama";

const throttle = pThrottle({
  limit: 20,
  interval: 200,
});

export async function extractBlocks() {
  logIfVerbose("Fetching blocks");

  const timestamps = await db
    .select({
      timestamp: calendar.timestamp,
      slug: networks.slug,
    })
    .from(calendar)
    .fullJoin(networks, sql`true`)
    .leftJoin(
      blocks,
      and(
        eq(blocks.timestamp, calendar.timestamp),
        eq(blocks.networkSlug, networks.slug),
      ),
    )
    .where(isNull(blocks.id));

  if (
    timestamps
      .map(({ slug }) => slug)
      .filter((slug) =>
        ["base", "optimism", "polygon-zkevm", "sepolia"].includes(slug!),
      ).length > 0
  ) {
    logIfVerbose(
      "Skipping block fetching because all blocks are already fetched",
    );
    return;
  }

  const results = await Promise.all(
    timestamps.map(({ timestamp, slug }) => {
      return throttle(async () => {
        try {
          logIfVerbose(
            `Fetching block for ${slug} at ${timestamp!.toISOString()}`,
          );
          return await DefiLlamaAPI.findBlockNumber(
            slug!,
            dateToEpoch(timestamp),
          );
        } catch (error) {
          // @ts-ignore
          if (error.message.includes("Rate limit exceeded"))
            logIfVerbose(
              `Rate limit while fetching block for ${slug} at ${timestamp!.toISOString()}`,
            );
          return null;
        }
      })();
    }),
  );

  await addToTable(
    blocks,
    results
      .map((block, index) => {
        if (!block) return {};

        const { timestamp, slug: networkSlug } = timestamps[index];
        return {
          timestamp,
          number: block,
          networkSlug,
          externalId: `${networkSlug}-${timestamp!.toISOString()}`,
        };
      })
      .filter((block) => Object.keys(block).length > 0),
  );

  logIfVerbose("Fetching blocks done");
}
