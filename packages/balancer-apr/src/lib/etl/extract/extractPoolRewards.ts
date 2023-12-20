/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginatedFetch } from "../../../paginatedFetch";

import { poolRewards } from "../../../db/schema";

import { NETWORK_TO_REWARDS_ENDPOINT_MAP } from "../../../config";
import { addToTable, logIfVerbose, networkNamesRewards } from "../../../index";

export const POOL_REWARDS = `
query PoolRewards($latestId: ID!) {
  rewardTokenDeposits(where: {rate_gt: 0, totalSupply_gt: 0, id_gt: $latestId}) {
		gauge{
      poolId
    }
    id
    rate
    totalSupply
    periodStart
    periodFinish
  }
}`;

export async function extractPoolRewards() {
  logIfVerbose("Starting Pool Rewards Extraction");
  return await Promise.all(
    networkNamesRewards.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_REWARDS_ENDPOINT_MAP[networkName];
      await extractRewardsForNetwork(networkEndpoint, networkName);
    }),
  );
}

async function extractRewardsForNetwork(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, POOL_REWARDS, (data) =>
    processPoolRewards(data, network),
  );
}

async function processPoolRewards(data: any, network: string) {
  logIfVerbose(`Processing pool rewards for network ${network}`);

  if (data.rewardTokenDeposits) {
    await addToTable(
      poolRewards,
      data.rewardTokenDeposits.map((rewards: any) => ({
        externalId: rewards.id,
        rawData: { ...rewards, network },
      })),
    );
  }
}
