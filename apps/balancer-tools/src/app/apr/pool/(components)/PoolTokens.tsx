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
  if (roundId) {
    poolData.perRound.map((pool) => {
      pool.tokens.map(async (token) => {
        // Is there a way to type this without recreating the interface?
        // @ts-ignore 2345
        const tprice = await getTokenPriceByRound(
          Round.getRoundByNumber(roundId),
          token.address,
          parseInt(pool.network),
        );
        // @ts-ignore 2345
        token.price = tprice;
      });
    });
  }
  return <PoolTokensTable poolStats={poolData.perRound[0]} />;
}
