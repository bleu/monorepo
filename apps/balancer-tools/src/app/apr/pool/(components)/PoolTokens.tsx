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
    const totalBalance = poolData.perRound[0].tokens.reduce((acc, token) => {
      const balance = parseFloat(token.balance);
      if (!isNaN(balance)) {
        return acc + balance;
      }
      return acc;
    }, 0);
    poolData.perRound[0].tokens.map(async (token) => {
      const tokenPrice = await getTokenPriceByRound(
        Round.getRoundByNumber(roundId),
        token.address,
        parseInt(poolData.perRound[0].network),
      );
      token.price = tokenPrice;
      token.percentageValue =
        ((tokenPrice * parseFloat(token.balance)) / totalBalance) * 100;
    });
  }
  return <PoolTokensTable poolTokensStats={poolData.perRound[0].tokens} />;
}
