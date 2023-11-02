import { dateToEpoch } from "@bleu-fi/utils/date";
import { eq } from "drizzle-orm";
import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { abi } from "#/abis/gaugesController";
import { db } from "#/db";
import { gauges, gaugeSnapshots, pools } from "#/db/schema";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
// Constants and Initializations
const GAUGES_CONTROLLER_MAINNET_ADDRESS =
  "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

// Helper Functions
async function getGaugeAddressFromDB(poolId: string) {
  const [dbGauge] = await db
    .select()
    .from(pools)
    .leftJoin(gauges, eq(gauges.poolExternalId, pools.externalId))
    .where(eq(pools.externalId, poolId));
  return dbGauge?.gauges?.address;
}

async function readContract(gaugeAddress: Address, time: number) {
  return await publicClient.readContract({
    address: GAUGES_CONTROLLER_MAINNET_ADDRESS,
    abi,
    functionName: "gauge_relative_weight",
    args: [gaugeAddress, BigInt(Math.floor(time))],
  });
}

// Main Function
export const getPoolRelativeWeight = async (
  poolId: string,
  time: number = dateToEpoch(new Date())
) => {
  const gaugeAddress = await getGaugeAddressFromDB(poolId);

  if (!gaugeAddress) return 0;

  try {
    const data = await readContract(gaugeAddress as Address, time);
    if (!data) return 0;

    const [gaugeSnapshot] = await db
      .insert(gaugeSnapshots)
      .values({
        gaugeAddress: gaugeAddress,
        timestamp: new Date(time),
        relativeWeight: String(Number(data) / 1e18),
      })
      .onConflictDoNothing()
      .returning();

    return gaugeSnapshot.relativeWeight
      ? gaugeSnapshot.relativeWeight / 1e18
      : 0;
  } catch (error) {
    throw new Error(
      `Error fetching relative weight for pools ${poolId}, ${time} - ${error}`
    );
  }
};
