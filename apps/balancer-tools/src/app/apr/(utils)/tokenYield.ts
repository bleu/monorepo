import { NetworkChainId } from "@bleu-balancer-tools/utils";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { rethRateProviderAbi } from "#/abis/rethRateProvider";
import { blocks } from "#/lib/gql/server";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const SECONDS_IN_DAY = 86400;

export async function getTokenYieldByPoolId() {
  const { currentRate, rate24hAgo } = await getDailyRateDiff();

  const calc = (currentRate - rate24hAgo) / rate24hAgo;

  const apr = ((1 + calc) ** 365 - 1) * 100;

  return apr;
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
    abi: rethRateProviderAbi,
    functionName: "getRate",
  });

  const rate24hAgo = await publicClient.readContract({
    address: "0x1a8F81c256aee9C640e14bB0453ce247ea0DFE6F",
    abi: rethRateProviderAbi,
    functionName: "getRate",
    blockNumber: BigInt(block24hAgo),
  });

  return { currentRate: Number(currentRate), rate24hAgo: Number(rate24hAgo) };
}
