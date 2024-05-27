import { Address, decodeAbiParameters } from "viem";
import { composableContext } from "./types";
import { bytes32ToAddress, getToken, getUser } from "./utils";
import { standaloneConstantProductAbi } from "../abis/StandaloneConstantProduct";
import { standaloneConstantProductFactoryAbi } from "../abis/StandaloneContantProductFactory";

interface IDecodeAndSaveInput {
  handler: Address;
  staticInput: `0x${string}`;
  context: composableContext;
  orderId: string;
  owner: Address;
}

export abstract class IHandlerHelper {
  abstract decodeAndSaveOrder(
    decodeAndSaveInput: IDecodeAndSaveInput
  ): Promise<void>;
}

export class StopLossHandlerHelper extends IHandlerHelper {
  async decodeAndSaveOrder({
    staticInput,
    context,
    orderId,
    owner,
  }: IDecodeAndSaveInput) {
    const user = await getUser(owner, context);

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

    await context.db.StopLossData.create({
      id: orderId,
      data: {
        orderId: orderId,
        userId: user.id,
        tokenInId: tokenIn.id,
        tokenOutId: tokenOut.id,
        tokenAmountIn: stopLossData[2],
        tokenAmountOut: stopLossData[3],
        appData: stopLossData[4],
        to: stopLossData[5],
        isSellOrder: stopLossData[6],
        isPartiallyFillable: stopLossData[7],
        validityBucketSeconds: stopLossData[8],
        sellTokenPriceOracle: bytes32ToAddress(stopLossData[9]),
        buyTokenPriceOracle: bytes32ToAddress(stopLossData[10]),
        strike: stopLossData[11],
        maxTimeSinceLastOracleUpdate: stopLossData[12],
      },
    });
  }
}

export class ProductConstantHandlerHelper extends IHandlerHelper {
  async decodeAndSaveOrder({
    staticInput,
    context,
    orderId,
    owner,
    handler,
  }: IDecodeAndSaveInput) {
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

    const [token0, token1, user] = await Promise.all([
      getToken(cowAmmData[0], context),
      getToken(cowAmmData[1], context),
      getUser(owner, context),
    ]);

    const constantProductData = {
      orderId: orderId,
      userId: user.id,
      token0Id: token0.id,
      token1Id: token1.id,
      minTradedToken0: cowAmmData[2],
      priceOracle: cowAmmData[3],
      priceOracleData: cowAmmData[4],
      appData: cowAmmData[5],
      version: "SafeModule",
    };

    const constantProductDataId = `${handler}-${user.id}`;

    await context.db.ConstantProductData.upsert({
      id: constantProductDataId,
      create: constantProductData,
      update: constantProductData,
    });
  }
}
export class StandaloneProductConstantHandlerHelper extends IHandlerHelper {
  async decodeAndSaveOrder({
    staticInput,
    context,
    orderId,
    handler,
    owner, // On this AMM owner is the new ProductConstant contract created
  }: IDecodeAndSaveInput) {
    // on the CoW AMM calls, the first 32 bytes aren't used by us, so we will remove them
    const usefulStaticInput = `0x${staticInput.slice(66)}` as const;
    const cowAmmData = decodeAbiParameters(
      [
        { name: "minTradedToken0", type: "uint256" },
        { name: "priceOracle", type: "address" },
        { name: "priceOracleData", type: "bytes" },
        { name: "appData", type: "bytes32" },
      ],
      usefulStaticInput
    );

    const [token0Address, token1Address, userAddress] = await Promise.all([
      context.client.readContract({
        abi: standaloneConstantProductAbi,
        address: owner,
        functionName: "token0",
      }),
      context.client.readContract({
        abi: standaloneConstantProductAbi,
        address: owner,
        functionName: "token1",
      }),
      context.client.readContract({
        abi: standaloneConstantProductFactoryAbi,
        address: handler,
        functionName: "owner",
        args: [owner],
      }),
    ]);

    const [token0, token1, user] = await Promise.all([
      getToken(token0Address, context),
      getToken(token1Address, context),
      getUser(userAddress, context),
    ]);
    const constantProductData = {
      orderId: orderId,
      userId: user.id,
      token0Id: token0.id,
      token1Id: token1.id,
      minTradedToken0: cowAmmData[0],
      priceOracle: cowAmmData[1],
      priceOracleData: cowAmmData[2],
      appData: cowAmmData[3],
      disabled: false,
      version: "Standalone",
    };
    const constantProductDataId = `${owner}-${user.id}`;

    await context.db.ConstantProductData.upsert({
      id: constantProductDataId,
      create: constantProductData,
      update: constantProductData,
    });
  }
}

export function getHandlerHelper(address: Address, context: composableContext) {
  const lowerCaseAddress = address.toLowerCase();
  const chainId = context.network.chainId as number;
  if (chainId === 1) {
    if (lowerCaseAddress === "0x34323b933096534e43958f6c7bf44f2bb59424da") {
      return new ProductConstantHandlerHelper();
    }
    if (
      [
        "0xe8212f30c28b4aab467df3725c14d6e89c2eb967",
        "0x6a8898f43676d8a3e9a5de286195558c3628a6d4",
      ].includes(lowerCaseAddress)
    ) {
      return new StopLossHandlerHelper();
    }
    if (lowerCaseAddress === "0x40664207e3375fb4b733d4743ce9b159331fd034") {
      return new StandaloneProductConstantHandlerHelper();
    }
  }

  if (chainId === 100) {
    if (lowerCaseAddress === "0xb148f40fff05b5ce6b22752cf8e454b556f7a851") {
      return new ProductConstantHandlerHelper();
    }
    if (
      [
        "0xe8212f30c28b4aab467df3725c14d6e89c2eb967",
        "0x5951ebf7dc5ddb9fd2fd6d5c7f4bc7b7509b463b",
      ].includes(lowerCaseAddress)
    ) {
      return new StopLossHandlerHelper();
    }
    if (lowerCaseAddress === "0xdb1cba3a87f2db53b6e1e6af48e28ed877592ec0") {
      return new StandaloneProductConstantHandlerHelper();
    }
  }

  if (chainId === 11155111) {
    if (lowerCaseAddress === "0x4bb23bf4802b4bbe9195637289bb4ffc835b221b") {
      return new ProductConstantHandlerHelper();
    }
    if (
      [
        "0xe8212f30c28b4aab467df3725c14d6e89c2eb967",
        "0xb560a403f8450164b8b745ecca41d8ced93c50a1",
      ].includes(lowerCaseAddress)
    ) {
      return new StopLossHandlerHelper();
    }
    if (lowerCaseAddress === "0xb808e8183e3a72d196457d127c7fd4befa0d7fd3") {
      return new StandaloneProductConstantHandlerHelper();
    }
  }

  throw new Error(`Handler not found for contract ${address}`);
}
