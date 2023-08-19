import { votingGaugeList } from "#/data/votingGaugeList";
import { pools } from "#/lib/gql/server";

//TODO consider block timetravel for this query

export async function getPoolList(amount = 10) {
  const listNetworks = Object.keys(votingGaugeList);

  const results = await Promise.all(
    listNetworks.map(async (network) => {
      const networkId = Number(network);
      const result = await pools.gql(String(network)).PoolsByTotalLiquidity({
        first: amount,
        poolIdList: votingGaugeList[networkId],
      });
      return { network, result: result.pools }; // Returning a structured object for each network
    }),
  );
  const flattenedPools = results.flatMap((networkObj) => {
    const { network, result } = networkObj;
    return result.map((pool) => ({
      ...pool,
      networkId: network,
    }));
  });

  const sortedPools = flattenedPools.sort((a, b) => {
    if (typeof a !== "string" && typeof b !== "string") {
      return b.totalLiquidity - a.totalLiquidity;
    }
    return 0; // or handle the case when a or b are strings
  });

  return sortedPools.slice(0, amount);
}
