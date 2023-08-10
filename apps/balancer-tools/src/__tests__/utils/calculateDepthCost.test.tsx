import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";

import { calculateDepthCost } from "#/app/poolsimulator/(components)/DepthCost";
import { PoolTypeEnum } from "#/app/poolsimulator/(types)";
import { convertAnalysisDataToAMM } from "#/app/poolsimulator/(utils)";

const mockAnalysisTokens = {
  balance: 0.7374307,
  decimal: 8,
  rate: 1,
  symbol: "WBTC",
};

const mockPairToken = {
  balance: 19.074547373249157,
  decimal: 18,
  rate: 1,
  symbol: "WETH",
};

describe("calculateDepthCost for Gyro2", () => {
  let mockAmm: AMM<PoolPairData>;

  const mockAnalysisDataGyro2 = {
    poolParams: {
      swapFee: 0.0025,
      sqrtAlpha: 3.3333333333333335,
      sqrtBeta: 4.47213595499958,
    },
    poolType: PoolTypeEnum.Gyro2,
    tokens: [
      { symbol: "WBTC", balance: 0.7374307, decimal: 8, rate: 1 },
      { symbol: "WETH", balance: 19.074547373249157, decimal: 18, rate: 1 },
    ],
  };

  beforeAll(async () => {
    const mockAmmPromise = await convertAnalysisDataToAMM(
      mockAnalysisDataGyro2,
    );
    if (!mockAmmPromise)
      throw new Error("Failed to convert mock analysis data to AMM");
    mockAmm = mockAmmPromise;
  });

  //alpha = 11.111111111111112
  //beta = 20.000000000000004
  it("should calculate depth cost for Gyro2CLP pool to price limit", () => {
    // spotPrice for in is = 0.06371432851920741
    // so (newSpotPrice < alphaBeta.alpha || newSpotPrice > alphaBeta.beta) is true
    const result = calculateDepthCost(
      mockPairToken,
      mockAnalysisTokens,
      "in",
      mockAnalysisDataGyro2,
      mockAmm,
      mockAnalysisDataGyro2.poolType,
    );

    expect(result.type).toBe("price limit");
  });
  it("should calculate depth cost for Gyro2CLP pool to 2% of price change", () => {
    // spotPrice for out is = 16.411089891869455
    // so (newSpotPrice < alphaBeta.alpha || newSpotPrice > alphaBeta.beta) is false
    const result = calculateDepthCost(
      mockPairToken,
      mockAnalysisTokens,
      "out",
      mockAnalysisDataGyro2,
      mockAmm,
      mockAnalysisDataGyro2.poolType,
    );

    expect(result.type).toBe("2% of price change");
  });
});

describe("calculateDepthCost for MetaStable", () => {
  let mockAmm: AMM<PoolPairData>;

  const mockAnalysisDataMetaStable = {
    poolParams: {
      swapFee: 0.0004,
      ampFactor: 50,
    },
    poolType: PoolTypeEnum.MetaStable,
    tokens: [
      { symbol: "WBTC", balance: 0.7374307, decimal: 8, rate: 1 },
      { symbol: "WETH", balance: 19.074547373249157, decimal: 18, rate: 1 },
    ],
  };

  beforeAll(async () => {
    const mockAmmPromise = await convertAnalysisDataToAMM(
      mockAnalysisDataMetaStable,
    );
    if (!mockAmmPromise)
      throw new Error("Failed to convert mock analysis data to AMM");
    mockAmm = mockAmmPromise;
  });

  it("should calculate depth cost for MetaStable pool", () => {
    const result = calculateDepthCost(
      mockPairToken,
      mockAnalysisTokens,
      "in",
      mockAnalysisDataMetaStable,
      mockAmm,
      mockAnalysisDataMetaStable.poolType,
    );

    expect(result.type).toBe("2% of price change");
  });
});
