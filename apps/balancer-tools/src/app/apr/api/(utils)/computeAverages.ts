import { calculatePoolData } from "../../(utils)/calculatePoolStats";
import { PoolStatsWithoutVotingShareAndCollectedFees } from "../route";

export const computeAverages = (formattedPoolData: {
  [key: string]: calculatePoolData[];
}): PoolStatsWithoutVotingShareAndCollectedFees => {
  const averages: PoolStatsWithoutVotingShareAndCollectedFees = {
    apr: {
      total: 0,
      breakdown: {
        veBAL: 0,
        swapFee: 0,
        //TODO: on #BAL-795 get tokenAPR from total
        tokens: {
          total: 0,
          breakdown: [],
        },
      },
    },
    balPriceUSD: 0,
    tvl: 0,
    volume: 0,
  };

  let totalDataCount = 0;
  const uniqueEntries: { [key: string]: { idx: number; occorencies: number } } =
    {};

  for (const key in formattedPoolData) {
    if (Object.hasOwnProperty.call(formattedPoolData, key)) {
      const dataArr = formattedPoolData[key];
      dataArr.forEach((data) => {
        averages.apr.total += data.apr.total;
        averages.apr.breakdown.veBAL += data.apr.breakdown.veBAL || 0;
        averages.apr.breakdown.swapFee += data.apr.breakdown.swapFee;
        averages.apr.breakdown.tokens.total +=
          data.apr.breakdown.tokens.total || 0;

        data.apr.breakdown.tokens.breakdown.map((tokenData) => {
          if (!uniqueEntries[tokenData.symbol]) {
            uniqueEntries[tokenData.symbol] = {
              idx: averages.apr.breakdown.tokens.breakdown.length,
              occorencies: 0,
            };
            averages.apr.breakdown.tokens.breakdown.push(tokenData);
          } else {
            uniqueEntries[tokenData.symbol].occorencies++;
            averages.apr.breakdown.tokens.breakdown[
              uniqueEntries[tokenData.symbol].idx
            ].yield += tokenData.yield;
          }
        });

        averages.balPriceUSD += data.balPriceUSD;
        averages.tvl += data.tvl;
        averages.volume += data.volume;
        totalDataCount++;
      });
    }
  }

  if (totalDataCount > 0) {
    averages.apr.total /= totalDataCount;
    averages.apr.breakdown.veBAL /= totalDataCount;
    averages.apr.breakdown.swapFee /= totalDataCount;
    averages.balPriceUSD /= totalDataCount;
    averages.tvl /= totalDataCount;
    averages.volume /= totalDataCount;
    averages.apr.breakdown.tokens.breakdown.map((tokenData) => {
      return {
        ...tokenData,
        yield: tokenData.yield / uniqueEntries[tokenData.symbol].occorencies,
      };
    });
  }

  return averages;
};
