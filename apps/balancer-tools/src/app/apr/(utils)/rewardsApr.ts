import { PoolRewardsQuery } from "@bleu-fi/gql/src/balancer-rewards/__generated__/Ethereum";
import { NetworkChainId } from "@bleu-fi/utils";

import { rewards } from "#/lib/gql/server";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import { doIntervalsIntersect, SECONDS_IN_YEAR } from "../api/(utils)/date";
import { fetchPoolAveragesForDateRange } from "./calculatePoolStats";
import { getTokenPriceByDate } from "./getBALPriceForDateRange";

type RewardInfo = ArrElement<
  GetDeepProp<PoolRewardsQuery, "rewardTokenDeposits">
>;

export async function getRewardsAprForDateRange(
  poolId: string,
  network: string,
  startAt: number,
  endAt: number,
) {
  let tempPoolId = "";
  let tempNetwork = "";

  switch (network) {
    case String(NetworkChainId.BASE): {
      tempPoolId = poolId;
      tempNetwork = network;
      break;
    }
    case String(NetworkChainId.POLYGONZKEVM): {
      tempPoolId = poolId;
      tempNetwork = network;
      break;
    }
    default: {
      tempPoolId =
        "0x17e7d59bb209a3215ccc25fffef7161498b7c10d000200000000000000000020";
      tempNetwork = String(NetworkChainId.BASE);
    }
  }

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

  const rewardsApr = await Promise.all(
    tokensRewards.map(async (tokenReward) => {
      const tokenYearlyAmount = tokenReward.yearlyAmount;
      const tokenPrice =
        (await getTokenPriceByDate(
          endAt,
          tokenReward.token.address,
          parseInt(tempNetwork),
        )) ?? 0;

      const tokenYearlyAmountInUsd = tokenYearlyAmount * tokenPrice;

      const totalSupplyInUsd = tokenReward.totalSupply * bptPrice;

      // reference for 10_000 https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L367
      const tokenApr = (tokenYearlyAmountInUsd / totalSupplyInUsd) * 10_000;
      return {
        token: tokenReward.token,
        amount: tokenYearlyAmountInUsd,
        bptPrice,
        liquidity: tvl,
        apr: tokenApr / 100,
      };
    }),
  );

  return rewardsApr;
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

  const duration = endAt - startAt;
  const annualScalingFactor = SECONDS_IN_YEAR / duration;

  const finalRewards = Object.values(groupedRewards).map((groupedReward) => ({
    token: groupedReward[0].token,
    yearlyAmount:
      calculateAmount(groupedReward, startAt, endAt) * annualScalingFactor,
    totalSupply: groupedReward[0].gauge.totalSupply,
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
