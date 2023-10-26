/* eslint-disable no-console */
import { PoolSnapshotInRangeQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";

import { pools, poolsWithCache } from "#/lib/gql/server";
import { GetDeepProp } from "#/utils/getTypes";

import { generateDateRange } from "../../api/(utils)/date";
import { getTokenPriceByDate } from "../getBALPriceForDateRange";
import { vunerabilityAffecteRateProviders } from "../vunerabilityAffectedPool";

type Snapshot = GetDeepProp<PoolSnapshotInRangeQuery, "poolSnapshots">;
type Pool = Snapshot[number]["pool"];

export async function fetchPoolData(
  chain: string,
  poolId: string,
  timeStart: number,
  timeEnd: number,
): Promise<Pool | null> {
  const rangeData = await poolsWithCache.gql(chain).poolSnapshotInRange({
    poolId,
    timestamp: generateDateRange(timeStart, timeEnd),
  });
  if (rangeData.poolSnapshots.length > 0) {
    return rangeData.poolSnapshots[0].pool;
  }
  const currentPoolData = await pools.gql(chain).Pool({ poolId });
  return currentPoolData?.pool || null;
}

export async function getTokenWeight(
  tokenAddress: string,
  endAtTimestamp: number,
  poolNetwork: string,
  poolData: Pool,
): Promise<number> {
  const { tokens, poolType, address: poolAddress } = poolData ?? {};

  const relevantTokens =
    tokens?.filter(({ address }) => address !== poolAddress) || [];

  const targetToken = relevantTokens.find(
    ({ address }) => address === tokenAddress,
  );

  if (!targetToken) {
    console.warn(`Token not found: ${tokenAddress}`);
    return 0;
  }

  if (poolType === "WEIGHTED" && targetToken.weight)
    return parseFloat(targetToken.weight);

  const tokenPrices = await fetchTokenPrices(
    relevantTokens,
    endAtTimestamp,
    poolNetwork,
  );
  const totalValue = relevantTokens
    .map(({ balance }, idx) => parseFloat(balance) * tokenPrices[idx])
    .filter((val) => !isNaN(val))
    .reduce((acc, val) => acc + val, 0);

  const tokenIdx = relevantTokens.findIndex(
    ({ address }) => address === tokenAddress,
  );
  return (parseFloat(targetToken.balance) * tokenPrices[tokenIdx]) / totalValue;
}

export async function fetchTokenPrices(
  relevantTokens: { address: string; symbol: string }[],
  endAtTimestamp: number,
  poolNetwork: string,
): Promise<number[]> {
  return Promise.all(
    relevantTokens.map(async (token) => {
      if (
        vunerabilityAffecteRateProviders.some(
          ({ address }) =>
            address.toLowerCase() === token.address.toLowerCase(),
        )
      ) {
        return 1;
      } else {
        const tokenPrice = await getTokenPriceByDate(
          endAtTimestamp,
          token.address,
          parseInt(poolNetwork),
        );

        if (tokenPrice === undefined) {
          console.warn(
            `Failed fetching price for ${token.symbol} (network: ${poolNetwork}, addr: ${token.address}) at ${endAtTimestamp}`,
          );
          return 1;
        }

        return tokenPrice;
      }
    }),
  );
}
