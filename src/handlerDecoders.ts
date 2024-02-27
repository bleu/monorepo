import { decodeAbiParameters } from "viem";
import { contextType } from "./types";
import { getToken } from "./utils";

export async function decodeAndSaveStopLoss(
  staticInput: `0x${string}`,
  context: contextType,
  eventId: string
): Promise<{ stopLossParametersId: string }> {
  const stopLossData = decodeAbiParameters(
    [
      { name: "sellToken", type: "address" },
      { name: "buyToken", type: "address" },
      { name: "sellAmount", type: "uint256" },
      { name: "buyAmount", type: "uint256" },
      { name: "appData", type: "bytes32" },
      { name: "receiver", type: "address" },
      { name: "isSellOrder", type: "bool" },
      { name: "isPartiallyFillable", type: "bool" },
      { name: "validityBucketSeconds", type: "uint256" },
      { name: "sellTokenPriceOracle", type: "bytes32" },
      { name: "buyTokenPriceOracle", type: "bytes32" },
      { name: "strike", type: "int256" },
      { name: "maxTimeSinceLastOracleUpdate", type: "uint256" },
    ],
    staticInput
  );
  const [tokenIn, tokenOut] = await Promise.all([
    getToken(stopLossData[0], context),
    getToken(stopLossData[1], context),
  ]);

  const StopLossParameters = await context.db.StopLossParameters.create({
    id: eventId,
    data: {
      orderId: eventId,
      tokenInId: tokenIn.id,
      tokenOutId: tokenOut.id,
      tokenAmountIn: stopLossData[2],
      tokenAmountOut: stopLossData[3],
      appData: stopLossData[4],
      to: stopLossData[5],
      isSellOrder: stopLossData[6],
      isPartiallyFillable: stopLossData[7],
      validityBucketSeconds: stopLossData[8],
      sellTokenPriceOracle: stopLossData[9],
      buyTokenPriceOracle: stopLossData[10],
      strike: stopLossData[11],
      maxTimeSinceLastOracleUpdate: stopLossData[12],
    },
  });
  return { stopLossParametersId: StopLossParameters.id };
}

export async function decodeAndSaveCoWAmm(
  staticInput: `0x${string}`,
  context: contextType,
  eventId: string
): Promise<{ cowAmmParametersId: string }> {
  // on the CoW AMM calls, the first 32 bytes aren't used by us, so we will remove them
  const usefulStaticInput = `0x${staticInput.slice(66)}` as const;
  const cowAmmData = decodeAbiParameters(
    [
      { name: "token0", type: "address" },
      { name: "token1", type: "address" },
      { name: "minTradedToken0", type: "uint256" },
      { name: "priceOracle", type: "address" },
      { name: "priceOracleData", type: "bytes" },
      { name: "appData", type: "bytes32" },
    ],
    usefulStaticInput
  );

  const [token0, token1] = await Promise.all([
    getToken(cowAmmData[0], context),
    getToken(cowAmmData[1], context),
  ]);

  const CoWAmmParameters = await context.db.CowAmmParameters.create({
    id: eventId,
    data: {
      orderId: eventId,
      token0Id: token0.id,
      token1Id: token1.id,
      minTradedToken0: cowAmmData[2],
      priceOracle: cowAmmData[3],
      priceOracleData: cowAmmData[4],
      appData: cowAmmData[5],
    },
  });
  return { cowAmmParametersId: CoWAmmParameters.id };
}

export const decodeAndSaveFunctions = {
  [1]: {
    "0x34323b933096534e43958f6c7bf44f2bb59424da": decodeAndSaveCoWAmm,
    "0xe8212f30c28b4aab467df3725c14d6e89c2eb967": decodeAndSaveStopLoss,
  },
  [100]: {
    "0xb148f40fff05b5ce6b22752cf8e454b556f7a851": decodeAndSaveCoWAmm,
    "0xe8212f30c28b4aab467df3725c14d6e89c2eb967": decodeAndSaveStopLoss,
  },
  [11155111]: {
    "0x4bb23bf4802b4bbe9195637289bb4ffc835b221b": decodeAndSaveCoWAmm,
    "0xe8212f30c28b4aab467df3725c14d6e89c2eb967": decodeAndSaveStopLoss,
  },
};

export function decodeAndSaveHandler(
  handler: `0x${string}`,
  staticInput: `0x${string}`,
  context: contextType,
  eventId: string
) {
  const chainId = context.network.chainId;
  const handlerFunction = (
    decodeAndSaveFunctions[chainId] as {
      [key: string]: (
        staticInput: `0x${string}`,
        context: contextType,
        eventId: string
      ) => Promise<any>;
    }
  )[handler.toLowerCase()];
  if (handlerFunction) {
    return handlerFunction(staticInput, context, eventId);
  }
  throw new Error("Handler not found");
}
