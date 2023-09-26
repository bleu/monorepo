import { calculatePoolData } from "../../(utils)/calculatePoolStats";
import {
  PoolStatsData,
  PoolStatsResults,
  PoolStatsWithoutVotingShareAndCollectedFees,
  tokenAPR,
} from "../route";

export const computeAverages = (formattedPoolData: {
  [key: string]: PoolStatsData[] | calculatePoolData[];
}): PoolStatsResults => {
  let averages = initializeAverages();

  const poolAverage: { [key: string]: PoolStatsData | calculatePoolData } = {};

  const uniqueTokenEntries: {
    [key: string]: { idx: number; occurences: number };
  } = {};

  let totalDataCount = 0;

  for (const key in formattedPoolData) {
    if (Object.hasOwnProperty.call(formattedPoolData, key)) {
      const dataArr = formattedPoolData[key];
      dataArr.forEach((data) => {
        averages = accumulateData(averages, data);
        accumulateTokens(
          averages.apr.breakdown.tokens,
          data.apr.breakdown.tokens,
          uniqueTokenEntries,
        );
        totalDataCount++;

        if (data.poolId in poolAverage) {
          // @ts-ignore  - Need help with this typing!
          poolAverage[data.poolId] = accumulateData(
            // @ts-ignore  - Need help with this typing!
            poolAverage[data.poolId],
            data,
          );
        } else {
          poolAverage[data.poolId] = data;
        }
      });
    }
  }

  if (totalDataCount > 0) {
    calculateAverages(
      averages,
      Object.keys(poolAverage).length,
      uniqueTokenEntries,
    );
    averages.poolAverage = calculateAveragesForPool(
      poolAverage,
      Object.keys(formattedPoolData).length,
    );
  }

  // @ts-ignore  - Need help with this typing!
  return averages;
};

function calculateAverageForObject(
  data: { [key: string]: PoolStatsData | calculatePoolData },
  divisor: number,
): PoolStatsData {
  const result = {} as PoolStatsData;

  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (Array.isArray(value)) {
        // @ts-ignore  - Need help with this typing!
        result[key] = value.map((item) =>
          typeof item === "object"
            ? calculateAverageForObject(item, divisor)
            : typeof item === "number"
            ? item / divisor
            : item,
        );
      } else if (typeof value === "number") {
        // @ts-ignore  - Need help with this typing!
        result[key] = value / divisor;
      } else {
        // @ts-ignore  - Need help with this typing!
        result[key] = value;
      }
    }
  }

  return result;
}

function calculateAveragesForPool(
  poolAverage: { [key: string]: PoolStatsData | calculatePoolData },
  divisor: number,
): PoolStatsData[] {
  const averagedOutput: PoolStatsData[] = [];

  for (const key in poolAverage) {
    // eslint-disable-next-line no-prototype-builtins
    if (poolAverage.hasOwnProperty(key)) {
      const poolStatsData = poolAverage[key];
      if (typeof poolStatsData === "object" && poolStatsData !== null) {
        const dividedStatsData = calculateAverageForObject(
          // @ts-ignore  - Need help with this typing!
          poolStatsData,
          divisor,
        );
        averagedOutput.push(dividedStatsData);
      }
    }
  }
  return averagedOutput;
}

function initializeAverages(): PoolStatsWithoutVotingShareAndCollectedFees {
  return {
    poolAverage: [],
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
  obj2: PoolStatsData | calculatePoolData,
) {
  const result = { ...obj1 };

  for (const key in obj2) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj2.hasOwnProperty(key) && obj1.hasOwnProperty(key)) {
      // @ts-ignore  - Need help with this typing!
      if (typeof obj1[key] === "string" && typeof obj2[key] === "string") {
        continue;
      } else if (
        // @ts-ignore  - Need help with this typing!
        Array.isArray(obj1[key]) &&
        // @ts-ignore  - Need help with this typing!
        Array.isArray(obj2[key])
      ) {
        // @ts-ignore  - Need help with this typing!
        result[key] = obj1[key].map((arrayChild, idx) => {
          // @ts-ignore  - Need help with this typing!
          return accumulateData(arrayChild, obj2[key][idx]);
        });
      } else if (
        // @ts-ignore  - Need help with this typing!
        typeof obj1[key] === "object" &&
        // @ts-ignore  - Need help with this typing!
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
  targetTokens?: { total: number; breakdown: tokenAPR[] },
  sourceTokens?: { total: number; breakdown: tokenAPR[] },
  uniqueEntries?: { [key: string]: { idx: number; occurences: number } },
): void {
  if (!targetTokens || !sourceTokens || !uniqueEntries) return;

  sourceTokens.breakdown.forEach((tokenData) => {
    if (!uniqueEntries[tokenData.symbol]) {
      uniqueEntries[tokenData.symbol] = {
        idx: targetTokens.breakdown.length,
        occurences: 0,
      };
      targetTokens.breakdown.push(tokenData);
    } else {
      uniqueEntries[tokenData.symbol].occurences++;
      const existingTokenData =
        targetTokens.breakdown[uniqueEntries[tokenData.symbol].idx];
      existingTokenData.yield =
        (existingTokenData.yield || 0) + (tokenData.yield || 0);
    }
  });
}

function calculateAverages(
  averages: PoolStatsWithoutVotingShareAndCollectedFees,
  totalDataCount: number,
  uniqueEntries: { [key: string]: { idx: number; occurences: number } },
): void {
  averages.apr.total /= totalDataCount;
  averages.apr.breakdown.veBAL /= totalDataCount;
  averages.apr.breakdown.swapFee /= totalDataCount;
  averages.balPriceUSD /= totalDataCount;
  averages.tvl /= totalDataCount;
  averages.volume /= totalDataCount;

  averages.apr.breakdown.tokens.breakdown.forEach((tokenData) => {
    tokenData.yield ||= 0;
    tokenData.yield /= uniqueEntries[tokenData.symbol].occurences;
  });
}
