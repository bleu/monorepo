import { eq } from "drizzle-orm";
import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { abi } from "#/abis/gaugesController";
import { db } from "#/db";
import { gauges, gaugeSnapshots, pools } from "#/db/schema";
import { withCache } from "#/lib/cache";

import { dateToEpoch } from "../api/(utils)/date";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
const GAUGES_CONTROLLER_MAINNET_ADDRESS =
  "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

export const getPoolRelativeWeight = withCache(
  async function getPoolRelativeWeightFn(
    poolId: string,
    time: number = dateToEpoch(new Date()),
  ) {
    const pool = await db
      .insert(pools)
      .values({
        externalId: poolId,
      })
      .onConflictDoNothing()
      .returning();
    const dbGauge = await db
      .select()
      .from(pools)
      .leftJoin(gauges, eq(gauges.poolExternalId, pools.externalId))
      .where(eq(pools.externalId, poolId));
    const gaugeAddress = dbGauge[0]?.gauges?.address;
    // const gaugeAddress = new Pool(poolId).gauges?.address;
    if (!gaugeAddress) return 0;

    try {
      const data = await publicClient.readContract({
        address: GAUGES_CONTROLLER_MAINNET_ADDRESS,
        abi,
        functionName: "gauge_relative_weight",
        args: [gaugeAddress as Address, BigInt(Math.floor(time))],
      });

      if (!data) {
        return 0;
      }

      const gauge = await db
        .insert(gauges)
        .values({
          poolExternalId: pool[0].externalId,
          address: gaugeAddress,
        })
        .onConflictDoNothing()
        .returning();
      const gaugeSnapshot = await db
        .insert(gaugeSnapshots)
        .values({
          gaugeId: gauge[0].id,
          timestamp: new Date(time),
          relativeWeight: Number(data),
        })
        .onConflictDoNothing()
        .returning();
      const relativeWeight = gaugeSnapshot[0].relativeWeight;
      return relativeWeight ? relativeWeight / 1e18 : 0;
    } catch (error) {
      throw new Error(
        `Error fetching relative weight for pools ${poolId}, ${time} - ${error}`,
      );
    }
  },
);
