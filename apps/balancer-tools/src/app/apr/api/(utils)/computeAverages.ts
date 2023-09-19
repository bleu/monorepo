import { PoolStats, PoolStatsWithoutVotingShareAndCollectedFees, tokenAPR } from "../route";

export const computeAverages = (
  formattedPoolData: { [key: string]: PoolStats[] }
): PoolStatsWithoutVotingShareAndCollectedFees => {
  const averages: PoolStatsWithoutVotingShareAndCollectedFees = initializeAverages();

  const uniqueTokenEntries: {
    [key: string]: { idx: number; occurences: number };
  } = {};

  let totalDataCount = 0;

  for (const key in formattedPoolData) {
    if (Object.hasOwnProperty.call(formattedPoolData, key)) {
      const dataArr = formattedPoolData[key];
      dataArr.forEach((data) => {
        accumulateData(averages, data);
        accumulateTokens(
          averages.apr.breakdown.tokens,
          data.apr.breakdown.tokens,
          uniqueTokenEntries,
        );
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

function accumulateData(
  obj1: PoolStatsWithoutVotingShareAndCollectedFees,
  obj2: PoolStatsData,
): PoolStatsData {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && obj1.hasOwnProperty(key)) {
      // @ts-ignore  - Need help with this typing!
      if (typeof obj1[key] === "string" && typeof obj2[key] === "string") {
        continue;
        // @ts-ignore  - Need help with this typing!
      } else if (
        typeof obj1[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        // @ts-ignore  - Need help with this typing!
        result[key] = accumulateData(obj1[key], obj2[key]);
      } else {
        // @ts-ignore  - Need help with this typing!
        result[key] = obj1[key] + obj2[key];
      }
    } else {
      // @ts-ignore  - Need help with this typing!
      result[key] = obj2[key];
    }
  }

  // @ts-ignore  - Need help with this typing!
  return result;
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