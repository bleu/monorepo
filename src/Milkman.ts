import { ponder } from "@/generated";

ponder.on("Milkman:SwapRequested", async ({ event, context }) => {

  const user = await context.entities.User.upsert({id: event.params.orderCreator})
  const tokenIn = await context.entities.Token.upsert({id: event.params.fromToken})
  const tokenOut = await context.entities.Token.upsert({id: event.params.toToken})

  let transaction = await context.entities.TransactionHash.findUnique({id: event.transaction.hash})
  if (!transaction) {
    transaction = await context.entities.TransactionHash.create({id: event.transaction.hash, data: {user: user.id, blockNumber: event.block.number, blockTimestamp: event.block.timestamp}})
  }

  await context.entities.Swap.create({
    id: event.log.id,
    data: {
      chainId: 5, // only tracking goerli currently, waiting ponder to expose chainId in event object
      status: "REQUESTED",
      tokenIn: tokenIn.id,
      tokenOut: tokenOut.id,
      tokenAmountIn: event.params.amountIn,
      priceChecker: event.params.priceChecker,
      priceCheckerData: event.params.priceCheckerData,
      orderContract: event.params.orderContract,
      to: event.params.to,
      transactionHash: transaction.id,
    }
  })
});
