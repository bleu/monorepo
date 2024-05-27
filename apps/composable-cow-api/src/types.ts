import { type Context } from "@/generated";

export type composableContext = Context<"composable:ConditionalOrderCreated">;
export type standaloneConstantProductFactoryContext =
  Context<"standaloneConstantProductFactoryAbi:ConditionalOrderCreated">;
export type contextType =
  | composableContext
  | standaloneConstantProductFactoryContext;
