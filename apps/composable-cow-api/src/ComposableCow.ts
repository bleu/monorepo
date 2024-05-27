import { ponder } from "@/generated";
import { getHandlerHelper } from "./handler";
import { getHash } from "./utils";

ponder.on("composable:ConditionalOrderCreated", async ({ event, context }) => {
  const hash = await getHash({
    salt: event.args.params.salt,
    staticInput: event.args.params.staticInput,
    handler: event.args.params.handler,
    context,
  }).catch(() => {
    return undefined;
  });

  const orderId = `${event.log.id}-${context.network.chainId}`;
  try {
    const handlerHelper = getHandlerHelper(event.args.params.handler, context);
    await context.db.Order.create({
      id: orderId,
      data: {
        chainId: context.network.chainId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        hash,
        txHash: event.log.transactionHash,
        salt: event.args.params.salt,
        staticInput: event.args.params.staticInput,
        handler: event.args.params.handler,
        owner: event.args.owner,
      },
    });
    await handlerHelper.decodeAndSaveOrder({
      staticInput: event.args.params.staticInput,
      context,
      orderId,
      handler: event.args.params.handler,
      owner: event.args.owner,
    });
  } catch (e) {
    console.log(e);
    return;
  }
});
