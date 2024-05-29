import { AMM } from "@bleu/math-poolsimulator/src";
import { PoolPairData } from "@bleu/math-poolsimulator/src/types";

import { calculateDepthCost } from "#/app/poolsimulator/(components)/DepthCost";
import { PoolTypeEnum } from "#/app/poolsimulator/(types)";
import { convertAnalysisDataToAMM } from "#/app/poolsimulator/(utils)";

const mockAnalysisTokens = {
  balance: 0.1374307,
  decimal: 8,
  rate: 1,
  symbol: "WBTC",
};

const mockPairToken = {
  balance: 30.074547373249157,
  decimal: 18,
  rate: 1,
  symbol: "WETH",
};

describe("calculateDepthCost for Gyro2", () => {
  let mockAmm: AMM<PoolPairData>;

  const mockAnalysisDataGyro2 = {
    poolParams: {
      swapFee: 0.0025,
      sqrtAlpha: 4,
      sqrtBeta: 4.47213595499958,
    },
    poolType: PoolTypeEnum.Gyro2,
    tokens: [
      { symbol: "WBTC", balance: 0.1374307, decimal: 8, rate: 1 },
      { symbol: "WETH", balance: 30.074547373249157, decimal: 18, rate: 1 },
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

  //alpha = 16
  //beta = 20.000000000000004
  it("should calculate depth cost for Gyro2CLP pool to price limit", () => {
    // new spotPrice for in is 20.094004778821677
    // so (newSpotPrice < alphaBeta.alpha || newSpotPrice > alphaBeta.beta) is true
    const result = calculateDepthCost(
      mockPairToken,
      mockAnalysisTokens,
      "out",
      mockAnalysisDataGyro2,
      mockAmm,
      mockAnalysisDataGyro2.poolType,
    );

    expect(result.type).toBe("price limit");
  });
  it("should calculate depth cost for Gyro2CLP pool to 2% of price change", () => {
    // new spotPrice for out is 0.052036494677798625
    // in beta and alpha scale it is 1 / 052036494677798625 = 19.21728214384606
    // so (newSpotPrice < alphaBeta.alpha || newSpotPrice > alphaBeta.beta) is false
    const result = calculateDepthCost(
      mockPairToken,
      mockAnalysisTokens,
      "in",
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
