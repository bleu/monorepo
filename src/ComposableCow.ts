import { ponder } from "@/generated";
import { erc20Abi } from "../abis/erc20";
import { decodeAbiParameters } from "viem";

ponder.on("composable:ConditionalOrderCreated", async ({ event, context }) => {
  function callERC20Contract<T>(
    address: `0x${string}`,
    functionName: "symbol" | "decimals" | "name"
  ): Promise<T> {
    return context.client.readContract({
      abi: erc20Abi,
      address,
      functionName,
    }) as Promise<T>;
  }

  function getErc20Data(address: `0x${string}`) {
    return Promise.all([
      callERC20Contract<string>(address, "symbol").catch(() => ""),
      callERC20Contract<number>(address, "decimals").catch(() => 0),
      callERC20Contract<string>(address, "name").catch(() => ""),
    ]);
  }

  async function getToken(address: `0x${string}`) {
    const tokenId = `${address}-${context.network.chainId}`;
    let token = await context.db.Token.findUnique({
      id: tokenId,
    });
    if (!token) {
      const [symbol, decimals, name] = await getErc20Data(address);
      token = await context.db.Token.create({
        id: `${address}-${context.network.chainId}`,
        data: {
          address,
          chainId: context.network.chainId,
          symbol,
          decimals,
          name,
        },
      });
    }
    return token;
  }

  const userId = `${event.args.owner}-${context.network.chainId}`;
  let user = await context.db["User"].findUnique({
    id: userId,
  });

  if (!user) {
    user = await context.db.User.create({
      id: userId,
      data: {
        address: event.args.owner,
        chainId: context.network.chainId,
      },
    });
  }

  //decode stop loss static input
  try {
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
      event.args.params.staticInput
    );

    const [tokenIn, tokenOut] = await Promise.all([
      getToken(stopLossData[0]),
      getToken(stopLossData[1]),
    ]);

    const orderParametersId = `${event.log.id}-${context.network.chainId}`;
    let orderParameters = await context.db["OrderParameters"].findUnique({
      id: orderParametersId,
    });

    if (!orderParameters) {
      orderParameters = await context.db.OrderParameters.create({
        id: orderParametersId,
        data: {
          orderId: event.log.id,
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
    }

    await context.db.Order.create({
      id: event.log.id,
      data: {
        chainId: context.network.chainId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        orderContract: event.args.params.handler,
        OrderParametersId: orderParameters.id,
        decodedSuccess: true,
        user: user.id,
      },
    });
  } catch (e) {
    await context.db.Order.create({
      id: event.log.id,
      data: {
        chainId: context.network.chainId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        orderContract: event.args.params.handler,
        decodedSuccess: false,
        user: user.id,
      },
    });
    return;
  }
});
