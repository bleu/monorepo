import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { abi } from "#/abis/gaugesController";
import { Pool } from "#/lib/balancer/gauges";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
const GAUGES_CONTROLLER_MAINNET_ADDRESS =
  "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

export async function getPoolRelativeWeight(
  poolId: string,
  time: number = Date.now() / 1000,
  // blockNumber?: bigint,
) {
  const gaugeAddress = new Pool(poolId).gauge?.address;
  if (!gaugeAddress) throw new Error(`No gauge found for pool ${poolId}`);

  try {
    const data = await publicClient.readContract({
      address: GAUGES_CONTROLLER_MAINNET_ADDRESS,
      abi,
      functionName: "gauge_relative_weight",
      args: [gaugeAddress as Address, BigInt(Math.floor(time))],
      // blockNumber,
    });

    return Number(data) / 1e18;
  } catch (error) {
    // If the gauge returns 0, it means it was not active at the time or does not have any votes
    return 0;
  }
}
