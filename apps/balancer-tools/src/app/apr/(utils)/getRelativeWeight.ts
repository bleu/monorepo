import { dateToEpoch } from "@bleu-fi/utils/date";
import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { abi } from "#/abis/gaugesController";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
// Constants and Initializations
const GAUGES_CONTROLLER_MAINNET_ADDRESS =
  "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

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
  gaugeAddress: string | null,
  time: number = dateToEpoch(new Date()),
) => {
  if (!gaugeAddress) return 0;

  try {
    const data = await readContract(gaugeAddress as Address, time);
    if (!data) return 0;
    return data ? Number(data) / 1e18 : 0;
  } catch (error) {
    throw new Error(
      `Error fetching relative weight for gauge ${gaugeAddress}, ${time} - ${error}`,
    );
  }
};
