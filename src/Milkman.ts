import { ponder } from "@/generated";

ponder.on("milkman:SwapRequested", async ({ event, context }) => {

  const user = await context.db.User.upsert({id: event.args.orderCreator})
  const tokenIn = await context.db.Token.upsert({id: event.args.fromToken})
  const tokenOut = await context.db.Token.upsert({id: event.args.toToken})

  let transaction = await context.db.TransactionHash.findUnique({id: event.transaction.hash})
  if (!transaction) {
    transaction = await context.db.TransactionHash.create({id: event.transaction.hash, data: {user: user.id, blockNumber: event.block.number, blockTimestamp: event.block.timestamp}})
  }

  await context.db.Swap.create({
    id: event.log.id,
    data: {
      chainId: 5, // only tracking goerli currently, waiting ponder to expose chainId in event object
      tokenInId: tokenIn.id,
      tokenOutId: tokenOut.id,
      tokenAmountIn: event.args.amountIn,
      priceChecker: event.args.priceChecker,
      priceCheckerData: event.args.priceCheckerData,
      orderContract: event.args.orderContract,
      to: event.args.to,
      transactionHash: event.transaction.hash,
      transactionHashId: event.transaction.hash,
    }
  })
});
