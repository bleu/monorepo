import { ponder } from "@/generated";
import { erc20Abi } from "../abis/erc20";

ponder.on("milkman:SwapRequested", async ({ event, context }) => {
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

  const userId = `${event.args.orderCreator}-${context.network.chainId}`;
  let user = await context.db["User"].findUnique({
    id: userId,
  });

  if (!user) {
    user = await context.db.User.create({
      id: userId,
      data: {
        address: event.args.orderCreator,
        chainId: context.network.chainId,
      },
    });
  }

  const [tokenIn, tokenOut] = await Promise.all([
    getToken(event.args.fromToken),
    getToken(event.args.toToken),
  ]);

  let transaction = await context.db.Transaction.findUnique({
    id: event.transaction.hash,
  });
  if (!transaction) {
    transaction = await context.db.Transaction.create({
      id: event.transaction.hash,
      data: {
        user: user.id,
        chainId: context.network.chainId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
      },
    });
  }

  await context.db.Swap.create({
    id: event.log.id,
    data: {
      chainId: context.network.chainId,
      tokenInId: tokenIn.id,
      tokenOutId: tokenOut.id,
      tokenAmountIn: event.args.amountIn,
      priceChecker: event.args.priceChecker,
      priceCheckerData: event.args.priceCheckerData,
      orderContract: event.args.orderContract,
      to: event.args.to,
      Transaction: event.transaction.hash,
      TransactionId: event.transaction.hash,
    },
  });
});
