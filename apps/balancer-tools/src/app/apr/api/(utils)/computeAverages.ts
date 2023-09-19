import { PoolStats, PoolStatsWithoutVotingShareAndCollectedFees, tokenAPR } from "../route";

export const computeAverages = (
  formattedPoolData: { [key: string]: PoolStats[] }
): PoolStatsWithoutVotingShareAndCollectedFees => {
  const averages: PoolStatsWithoutVotingShareAndCollectedFees = initializeAverages();

  const uniqueEntries: {
    [key: string]: { idx: number; occurences: number };
  } = {};

  let totalDataCount = 0;

  for (const key in formattedPoolData) {
    if (Object.hasOwnProperty.call(formattedPoolData, key)) {
      const dataArr = formattedPoolData[key];
      dataArr.forEach((data) => {
        accumulateData(averages, data);
        accumulateTokens(averages.apr.breakdown.tokens, data.apr.breakdown.tokens, uniqueEntries);
        accumulateOtherMetrics(averages, data);
        totalDataCount++;
      });
    }
  }

  if (totalDataCount > 0) {
    calculateAverages(averages, totalDataCount, uniqueEntries);
  }

  return averages;
};

function initializeAverages(): PoolStatsWithoutVotingShareAndCollectedFees {
  return {
    apr: {
      total: 0,
      breakdown: {
        veBAL: 0,
        swapFee: 0,
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
}

function accumulateData(target: PoolStatsWithoutVotingShareAndCollectedFees, source: PoolStatsWithoutVotingShareAndCollectedFees): void {
  target.apr.total += source.apr.total;
  target.apr.breakdown.veBAL += source.apr.breakdown.veBAL || 0;
  target.apr.breakdown.swapFee += source.apr.breakdown.swapFee;
  target.apr.breakdown.tokens.total += source.apr.breakdown.tokens.total;
}

function accumulateTokens(
  targetTokens: { total: number; breakdown: tokenAPR[] },
  sourceTokens: { total: number; breakdown: tokenAPR[] },
  uniqueEntries: { [key: string]: { idx: number; occurences: number } }
): void {
  sourceTokens.breakdown.forEach((tokenData) => {
    if (!uniqueEntries[tokenData.symbol]) {
      uniqueEntries[tokenData.symbol] = {
        idx: targetTokens.breakdown.length,
        occurences: 0,
      };
      targetTokens.breakdown.push(tokenData);
    } else {
      uniqueEntries[tokenData.symbol].occurences++;
      const existingTokenData = targetTokens.breakdown[uniqueEntries[tokenData.symbol].idx];
      existingTokenData.yield += tokenData.yield;
    }
  });
}

function accumulateOtherMetrics(target: PoolStatsWithoutVotingShareAndCollectedFees, source: PoolStats): void {
  target.balPriceUSD += source.balPriceUSD;
  target.tvl += source.tvl;
  target.volume += source.volume;
}

function calculateAverages(
  averages: PoolStatsWithoutVotingShareAndCollectedFees,
  totalDataCount: number,
  uniqueEntries: { [key: string]: { idx: number; occurences: number } }
): void {
  averages.apr.total /= totalDataCount;
  averages.apr.breakdown.veBAL /= totalDataCount;
  averages.apr.breakdown.swapFee /= totalDataCount;
  averages.balPriceUSD /= totalDataCount;
  averages.tvl /= totalDataCount;
  averages.volume /= totalDataCount;

  averages.apr.breakdown.tokens.breakdown.forEach((tokenData) => {
    tokenData.yield /= uniqueEntries[tokenData.symbol].occurences;
  });
}