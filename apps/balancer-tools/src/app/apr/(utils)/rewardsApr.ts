import { PoolRewardsQuery } from "@bleu-balancer-tools/gql/src/balancer-rewards/__generated__/Ethereum";
import { NetworkChainId } from "@bleu-balancer-tools/utils";

import { rewards } from "#/lib/gql/server";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import { doIntervalsIntersect } from "../api/(utils)/date";
import { fetchPoolAveragesForDateRange } from "./calculatePoolStats";

type RewardInfo = ArrElement<
  GetDeepProp<PoolRewardsQuery, "rewardTokenDeposits">
>;

export async function getRewardsAprForDateRange(
  //TODO: remove unused params on BAL-972
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  poolId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  network: string,
  startAt: number,
  endAt: number,
) {
  //TODO: remove temp variables on BAL-972
  const tempPoolId =
    "0x17e7d59bb209a3215ccc25fffef7161498b7c10d000200000000000000000020";
  const tempNetwork = String(NetworkChainId.BASE);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tvl, volume, symbol, bptPrice] = await fetchPoolAveragesForDateRange(
    tempPoolId,
    tempNetwork,
    startAt,
    endAt,
  );

  const tokensRewards = await getTokensRewards({
    startAt,
    endAt,
    poolId: tempPoolId,
    network: tempNetwork,
  });

  if (tokensRewards.length === 0) {
    return [];
  }

  const rewards = tokensRewards.map((tokenReward) => {
    const tokenAmount = tokenReward.amount;
    // reference for 10_000 https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L367
    const tokenApr = ((tokenAmount * bptPrice) / tvl) * 10_000 * 7;
    return {
      token: tokenReward.token,
      amount: tokenAmount,
      bptPrice,
      liquidity: tvl,
      apr: tokenApr,
    };
  });
  return rewards;
}

export async function getTokensRewards({
  startAt,
  endAt,
  poolId,
  network,
}: {
  startAt: number;
  endAt: number;
  poolId: string;
  network: string;
}) {
  const response = await rewards.gql(network).PoolRewards({
    poolId,
  });

  if (!response.rewardTokenDeposits) {
    return [];
  }

  const intersectedRewards = response.rewardTokenDeposits.filter((reward) =>
    doIntervalsIntersect(
      Number(reward.periodStart),
      Number(reward.periodFinish),
      startAt,
      endAt,
    ),
  );

  const groupedRewards: Record<string, RewardInfo[]> = {};
  intersectedRewards.forEach((reward) => {
    const address = reward.token.address;
    groupedRewards[address] = groupedRewards[address] || [];
    groupedRewards[address].push(reward);
  });

  const finalRewards = Object.values(groupedRewards).map((groupedReward) => ({
    token: groupedReward[0].token,
    amount: calculateAmount(groupedReward, startAt, endAt),
  }));

  return finalRewards;
}

function calculateAmount(
  rewards: RewardInfo[],
  startAt: number,
  endAt: number,
): number {
  return rewards.reduce((accum, rewardInfo) => {
    const periodStart = Number(rewardInfo.periodStart);
    const periodFinish = Number(rewardInfo.periodFinish);
    const rate = Number(rewardInfo.rate);

    if (!doIntervalsIntersect(periodStart, periodFinish, startAt, endAt)) {
      return accum;
    }

    const effectiveStart = Math.max(startAt, periodStart);
    const effectiveEnd = Math.min(endAt, periodFinish);
    return accum + (effectiveEnd - effectiveStart) * rate;
  }, 0);
}
