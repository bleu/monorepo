import { PoolRewardsQuery } from "@bleu-balancer-tools/gql/src/balancer-rewards/__generated__/Ethereum";

import { rewards } from "#/lib/gql/server";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

type RewardInfo = ArrElement<
  GetDeepProp<PoolRewardsQuery, "rewardTokenDeposits">
>;

export async function getTokensRewards() {
  const response = await rewards.gql(String(8453)).PoolRewards({
    poolId:
      "0xe40cbccba664c7b1a953827c062f5070b78de86800020000000000000000001b",
  });

  const startAt = 1694044800;
  const endAt = 1694131200;

  const intersectedRewards = response.rewardTokenDeposits.filter((reward) =>
    isTimePeriodsIntersecting(
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

  console.log(finalRewards);
}

function isTimePeriodsIntersecting(
  periodStart: number,
  periodFinish: number,
  startAt: number,
  endAt: number,
): boolean {
  return (
    (startAt <= periodFinish && endAt >= periodStart) ||
    (periodStart <= endAt && periodFinish >= startAt)
  );
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

    if (!isTimePeriodsIntersecting(periodStart, periodFinish, startAt, endAt)) {
      return accum;
    }

    const effectiveStart = Math.max(startAt, periodStart);
    const effectiveEnd = Math.min(endAt, periodFinish);
    return accum + (effectiveEnd - effectiveStart) * rate;
  }, 0);
}
