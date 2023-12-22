import { and, asc, eq } from "drizzle-orm";
import { Address } from "viem";

import { db } from "../../../db/index";
import {
  blocks,
  calendar,
  pools,
  poolTokenRateProviders,
  poolTokenRateProvidersSnapshot,
} from "../../../db/schema";
import { logIfVerbose, networkNames } from "../../../index";
import { vunerabilityAffecteRateProviders } from "../../../vunerabilityAffectedPool";
import { getRates } from "../../getRates";

export async function extractPoolRateProviderSnapshot(network: string) {
  logIfVerbose("Starting Pool Rate Provider Snapshot Extraction");
  const distinctRateProviders = await db
    .selectDistinct({
      rateProviderAddress: poolTokenRateProviders.address,
      networkSlug: poolTokenRateProviders.networkSlug,
      vunerabilityAffected: poolTokenRateProviders.vulnerabilityAffected,
    })
    .from(poolTokenRateProviders)
    .where(eq(poolTokenRateProviders.networkSlug, network));

  const blocksTimestamp = await db
    .select({
      blockNumber: blocks.number,
      timestamp: blocks.timestamp,
    })
    .from(blocks)
    .leftJoin(calendar, eq(calendar.timestamp, blocks.timestamp))
    .where(eq(blocks.networkSlug, network))
    .orderBy(asc(blocks.number));

  const blocksNumberArraySinceBalStartDate = blocksTimestamp.map((item) => {
    return {
      blockNumber: item.blockNumber as number,
      timestamp: item.timestamp as Date,
    };
  });

  const filterBlocksByDate = (
    blocks: { timestamp: Date; blockNumber: number }[],
    startDate: Date | null,
    cutDirection: "before" | "after",
  ) => {
    if (!startDate) return blocks;
    return cutDirection === "before"
      ? blocks.filter(
          ({ timestamp }) => timestamp.getTime() < startDate.getTime(),
        )
      : blocks.filter(
          ({ timestamp }) => timestamp.getTime() > startDate.getTime(),
        );
  };
  const blocksNumberArrayChainNode = filterBlocksByDate(
    blocksNumberArraySinceBalStartDate,
    new Date("2023-02-10"),
    "after",
  );

  const blocksNumberArrayUntilEulerVunerability = filterBlocksByDate(
    blocksNumberArrayChainNode,
    new Date("2023-03-13"),
    "before",
  );

  const blocksNumberArrayUntilBalVunerability = filterBlocksByDate(
    blocksNumberArrayChainNode,
    new Date("2023-08-22"),
    "before",
  );

  const rateProviderAddressBlocksTuplesPromise: Promise<
    [Address, string, { blockNumber: number; timestamp: Date }[]][]
  > = Promise.all(
    distinctRateProviders.map(
      async ({ rateProviderAddress, networkSlug, vunerabilityAffected }) => {
        const poolsStartDate = await db
          .select({
            createdAt: pools.externalCreatedAt,
          })
          .from(pools)
          .leftJoin(
            poolTokenRateProviders,
            eq(poolTokenRateProviders.poolExternalId, pools.externalId),
          )
          .where(
            and(
              eq(poolTokenRateProviders.address, String(rateProviderAddress)),
              eq(poolTokenRateProviders.networkSlug, String(networkSlug)),
            ),
          );
        const poolsStartDateArray = poolsStartDate.map((item) => {
          return item.createdAt as Date;
        });

        const minStartDate = poolsStartDateArray.reduce(
          (min, current) => (min < current ? min : current),
          poolsStartDateArray[0],
        );
        const isBbPool =
          !!vunerabilityAffecteRateProviders
            .find(
              ({ address }) =>
                address.toLowerCase() === rateProviderAddress!.toLowerCase(),
            )
            ?.symbol.includes("bb-e") || false;
        const vulnerabilityBlocksArray =
          vunerabilityAffected && isBbPool
            ? filterBlocksByDate(
                blocksNumberArrayUntilEulerVunerability,
                minStartDate,
                "after",
              )
            : vunerabilityAffected
              ? filterBlocksByDate(
                  blocksNumberArrayUntilBalVunerability,
                  minStartDate,
                  "after",
                )
              : filterBlocksByDate(
                  blocksNumberArrayChainNode,
                  minStartDate,
                  "after",
                );
        return [
          rateProviderAddress as Address,
          networkSlug as string,
          vulnerabilityBlocksArray as {
            blockNumber: number;
            timestamp: Date;
          }[],
        ];
      },
    ),
  );
  const rateProviderAddressBlocksTuples =
    await rateProviderAddressBlocksTuplesPromise;

  for (const [
    rateProviderAddress,
    networkSlug,
    blocksNumberArray,
  ] of rateProviderAddressBlocksTuples) {
    const rateProviderTuples: [Address, string, number, Date][] =
      blocksNumberArray.map(({ blockNumber, timestamp }) => [
        rateProviderAddress as Address,
        networkSlug as string,
        blockNumber as number,
        timestamp as Date,
      ]);

    logIfVerbose(
      `Fetching ${rateProviderTuples.length} rates for ${rateProviderAddress} on ${networkSlug}`,
    );
    try {
      const rates = await getRates(rateProviderTuples);

      for (const [address, network, block, timestamp, rate] of rates) {
        db.insert(poolTokenRateProvidersSnapshot)
          .values({
            rateProviderAddress: address,
            networkSlug: network,
            blockNumber: block,
            rate: String(rate),
            externalId: `${address}-${network}-${block}`,
            timestamp,
          })
          .onConflictDoNothing()
          .execute();
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (error) {
      logIfVerbose(
        `error fetching rate for ${rateProviderAddress}, from ${
          blocksNumberArray[0].timestamp
        } to ${
          blocksNumberArray[blocksNumberArray.length - 1].timestamp
        } : ${error}`,
      );
    }
  }
}

export async function extractPoolRateProviderSnapshots() {
  logIfVerbose("Starting Pool Rate Provider Snapshot Extraction");
  await Promise.all(
    networkNames.map(async (networkName) => {
      await extractPoolRateProviderSnapshot(networkName);
    }),
  );
}
