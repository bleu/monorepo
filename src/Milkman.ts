import { ponder } from "@/generated";

ponder.on("Milkman:SwapRequested", async ({ event, context }) => {
  await context.entities.Swap.create({
    id: event.log.id,
    data: {
      chainId: 5, // only tracking goerli currently, waiting ponder to expose chainId in event object
      userAddress: event.params.priceChecker,
      tokenInAddress: event.params.fromToken,
      tokenAmountIn: event.params.amountIn,
      tokenOutAddress: event.params.toToken,
      priceChecker: event.params.priceChecker,
      priceCheckerData: event.params.priceCheckerData,
    }
  })
});
