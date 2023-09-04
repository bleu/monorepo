import { fetcher } from "#/utils/fetcher";

import { getTokenPriceByRound } from "../../(utils)/getBALPriceByRound";
import { Round } from "../../(utils)/rounds";
import { BASE_URL, PoolStatsResults } from "../../api/route";
import PoolTokensTable from "./PoolTokensTable";

export default async function PoolTokens({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const poolData: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}${
      roundId ? `&roundId=${roundId}` : ""
    }`,
  );
  return (
    <PoolTokensTable
      poolTokensStats={poolData.perRound[0].tokens}
      poolNetwork={poolData.perRound[0].network}
    />
  );
}
