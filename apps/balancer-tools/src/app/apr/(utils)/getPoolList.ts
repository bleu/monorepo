import { NetworkChainId } from "@bleu-balancer-tools/utils";

import { votingGaugeList } from "#/data/votingGaugeList";
import { pools } from "#/lib/gql/server";

//TODO consider block timetravel for this query

export async function getPoolList({
  network,
  amount = 10,
}: {
  network: NetworkChainId;
  amount?: number;
}) {
  const result = await pools.gql(String(network)).PoolsByTotalLiquidity({
    first: amount,
    poolIdList: votingGaugeList[network],
  });

  return result.pools;
}
