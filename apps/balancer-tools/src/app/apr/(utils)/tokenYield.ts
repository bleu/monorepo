import { NetworkChainId } from "@bleu-balancer-tools/utils";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { blocks } from "#/lib/gql/server";

const rateProviderAbi = [
  {
    inputs: [],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const SECONDS_IN_DAY = 86400;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getTokenAprByPoolId(poolId: string) {
  const { currentRate, rate24hAgo } = await getDailyRateDiff();

  return [
    {
      address: "0xae78736cd615f374d3085123a210448e74fc6393",
      symbol: "rETH",
      yield: ((currentRate - rate24hAgo) / 10 ** 18) * 365 * 100,
    },
  ];
}

async function getDailyRateDiff() {
  const now = Math.round(new Date().getTime() / 1000);

  const data = await blocks.gql(String(NetworkChainId.ETHEREUM)).Blocks({
    timestamp_gte: now - SECONDS_IN_DAY,
    timestamp_lt: now,
  });

  const block24hAgo = data.blocks[0].number;

  const currentRate = await publicClient.readContract({
    address: "0x1a8F81c256aee9C640e14bB0453ce247ea0DFE6F",
    abi: rateProviderAbi,
    functionName: "getRate",
  });

  const rate24hAgo = await publicClient.readContract({
    address: "0x1a8F81c256aee9C640e14bB0453ce247ea0DFE6F",
    abi: rateProviderAbi,
    functionName: "getRate",
    blockNumber: BigInt(block24hAgo),
  });

  return { currentRate: Number(currentRate), rate24hAgo: Number(rate24hAgo) };
}
