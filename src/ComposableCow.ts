import { ponder } from "@/generated";
import { decodeAndSaveHandler } from "./handlerDecoders";
import { getHash } from "./utils";

ponder.on("composable:ConditionalOrderCreated", async ({ event, context }) => {
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
  const hash = await getHash({
    salt: event.args.params.salt,
    staticInput: event.args.params.staticInput,
    handler: event.args.params.handler,
    context,
  });

  try {
    const handlerData = await decodeAndSaveHandler(
      event.args.params.handler,
      event.args.params.staticInput,
      context,
      `${event.log.id}-${context.network.chainId}`
    );
    await context.db.Order.create({
      id: event.log.id,
      data: {
        hash: hash,
        salt: event.args.params.salt,
        chainId: context.network.chainId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        handler: event.args.params.handler,
        staticInput: event.args.params.staticInput,
        decodedSuccess: true,
        user: user.id,
        ...handlerData,
      },
    });
  } catch (e) {
    await context.db.Order.create({
      id: event.log.id,
      data: {
        hash: hash,
        salt: event.args.params.salt,
        chainId: context.network.chainId,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        handler: event.args.params.handler,
        staticInput: event.args.params.staticInput,
        decodedSuccess: false,
        user: user.id,
      },
    });
    return;
  }
});
