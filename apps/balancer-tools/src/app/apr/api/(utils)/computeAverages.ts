import { calculatePoolData } from "../../(utils)/calculatePoolStats";
import {
  PoolStatsData,
  PoolStatsWithoutVotingShareAndCollectedFees,
  tokenAPR,
} from "../route";

export const computeAverages = (formattedPoolData: {
  [key: string]: PoolStatsData[] | calculatePoolData[];
}): PoolStatsWithoutVotingShareAndCollectedFees => {
  const averages: PoolStatsWithoutVotingShareAndCollectedFees =
    initializeAverages();
  const poolAverage: { [key: string]: PoolStatsData | calculatePoolData } = {};

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

        if (data.poolId in poolAverage) {
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
    calculateAverages(averages, totalDataCount, uniqueTokenEntries);
    CalculateAveragesForPool(
      poolAverage,
      Object.keys(formattedPoolData).length,
      averages.poolAverage,
    );
  }

  return averages;
};

function CalculateAveragesForPool(
  poolAverage: { [key: string]: PoolStatsData | calculatePoolData },
  divisor: number,
  output: PoolStatsData[] | calculatePoolData[],
) {
  for (const key in poolAverage) {
    const poolStatsData = poolAverage[key];
    if (typeof poolStatsData === "object" && poolStatsData !== null) {
      const dividedStatsData = {} as PoolStatsData;

      for (const subKey in poolStatsData) {
        // eslint-disable-next-line no-prototype-builtins
        if (poolStatsData.hasOwnProperty(subKey)) {
          if (
            Array.isArray(poolStatsData[subKey as keyof PoolStatsData])
          ) {
            // @ts-ignore  - Need help with this typing!
            dividedStatsData[subKey] = poolStatsData[subKey].map((arrayChild) => {
              if(typeof arrayChild === "object") {
                const averageChildObj = {};
                for (const [childKey, value] of Object.entries(arrayChild)) {
                  if (typeof value === "number") {
                    // @ts-ignore  - Need help with this typing!
                    averageChildObj[childKey] = value / divisor;
                  } else {
                    // @ts-ignore  - Need help with this typing!
                    averageChildObj[childKey] = value;
                  }
                }
                return averageChildObj;
              } else {
                if (typeof arrayChild === "number") {
                  return arrayChild / divisor;
                } else {
                  return arrayChild;
                }
              }
            });
          } else if (
            typeof poolStatsData[subKey as keyof PoolStatsData] === "number"
          ) {
            // @ts-ignore  - Need help with this typing!
            dividedStatsData[subKey] = poolStatsData[subKey] / divisor;
          } else {
            // @ts-ignore  - Need help with this typing!
            dividedStatsData[subKey] = poolStatsData[subKey];
          }
        }
      }

      output.push(dividedStatsData);
    }
  }
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
): PoolStatsData {
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
        result[key] = obj1[key].map((arrayChild, idx)=>{
          // @ts-ignore  - Need help with this typing!
          return accumulateData(arrayChild, obj2[key][idx])
        })
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
  targetTokens: { total: number; breakdown: tokenAPR[] },
  sourceTokens: { total: number; breakdown: tokenAPR[] },
  uniqueEntries: { [key: string]: { idx: number; occurences: number } },
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
      const existingTokenData =
        targetTokens.breakdown[uniqueEntries[tokenData.symbol].idx];
      existingTokenData.yield += tokenData.yield;
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
    tokenData.yield /= uniqueEntries[tokenData.symbol].occurences;
  });
}
