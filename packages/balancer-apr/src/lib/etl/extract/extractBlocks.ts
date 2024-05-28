/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateToEpoch } from "@bleu/utils/date";
import { and, desc, eq, isNull, lt, not, sql } from "drizzle-orm";
import { addToTable } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";
import pThrottle from "p-throttle";

import { db } from "../../../db/index";
import { blocks, calendar, networks } from "../../../db/schema";
import { DefiLlamaAPI } from "../../../lib/defillama";

const throttle = pThrottle({
  limit: 10,
  interval: 1000,
});

// Except for base, these are arbitrary dates
const CHAIN_FIRST_BLOCK_TIMESTAMP_MAP = {
  base: new Date("2023-06-15T12:35:47Z"),
  "polygon-zkevm": new Date("2023-05-07T00:00:00Z"),
  optimism: new Date("2021-11-12T00:00:00.000Z"),
  arbitrum: new Date("2021-06-11T00:00:00.000Z"),
};

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
        eq(blocks.networkSlug, networks.slug)
      )
    )
    .where(
      and(
        isNull(blocks.id),
        not(eq(networks.slug, "sepolia")),
        not(eq(networks.slug, "goerli")),
        not(
          and(
            eq(networks.slug, "arbitrum"),
            lt(calendar.timestamp, CHAIN_FIRST_BLOCK_TIMESTAMP_MAP["arbitrum"])
          )!
        ),
        not(
          and(
            eq(networks.slug, "base"),
            lt(calendar.timestamp, CHAIN_FIRST_BLOCK_TIMESTAMP_MAP["base"])
          )!
        ),
        not(
          and(
            eq(networks.slug, "optimism"),
            lt(calendar.timestamp, CHAIN_FIRST_BLOCK_TIMESTAMP_MAP["optimism"])
          )!
        ),
        not(
          and(
            eq(networks.slug, "polygon-zkevm"),
            lt(
              calendar.timestamp,
              CHAIN_FIRST_BLOCK_TIMESTAMP_MAP["polygon-zkevm"]
            )
          )!
        )
      )
    )
    .orderBy(desc(calendar.timestamp));

  const results = await Promise.all(
    timestamps.map(({ timestamp, slug }) => {
      return throttle(async () => {
        try {
          logIfVerbose(
            `Fetching block for ${slug} at ${timestamp!.toISOString()}`
          );
          return await DefiLlamaAPI.findBlockNumber(
            slug!,
            dateToEpoch(timestamp)
          );
        } catch (error) {
          // @ts-ignore
          logIfVerbose(error.message);
          // @ts-expect-error
          if (error.message.includes("Rate limit exceeded"))
            logIfVerbose(
              `Rate limit while fetching block for ${slug} at ${timestamp!.toISOString()}`
            );
          return null;
        }
      })();
    })
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
      .filter((block) => Object.keys(block).length > 0)
  );

  logIfVerbose("Fetching blocks done");
}
