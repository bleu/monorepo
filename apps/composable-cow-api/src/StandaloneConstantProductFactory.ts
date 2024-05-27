import { ponder } from "@/generated";
import { StandaloneProductConstantHandlerHelper } from "./handler";
import { getHash, getUser } from "./utils";
import { standaloneConstantProductFactoryAbi } from "../abis/StandaloneContantProductFactory";
import { Address } from "viem";

ponder.on(
  "standaloneConstantProductFactoryAbi:ConditionalOrderCreated",
  async ({ event, context }) => {
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
      const handlerHelper = new StandaloneProductConstantHandlerHelper();
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
  }
);

ponder.on(
  "standaloneConstantProductFactoryAbi:TradingDisabled",
  async ({ event, context }) => {
    const userAddress = await context.client.readContract({
      abi: standaloneConstantProductFactoryAbi,
      address: context.contracts.standaloneConstantProductFactoryAbi
        .address as Address,
      functionName: "owner",
      args: [event.args.amm],
    });

    const user = await getUser(userAddress, context);
    await context.db.ConstantProductData.update({
      id: `${event.args.amm}-${user.id}`,
      data: { disabled: true },
    });
  }
);
