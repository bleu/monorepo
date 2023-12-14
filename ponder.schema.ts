import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Swap: p.createTable({
    id: p.string(),
    chainId: p.int(),
    tokenInId: p.string().references("Token.id"),
    tokenIn: p.one("tokenInId"),
    tokenAmountIn: p.bigint(),
    tokenOutId: p.string().references("Token.id"),
    tokenOut: p.one("tokenOutId"),
    priceChecker: p.bytes(),
    priceCheckerData: p.bytes(),
    orderContract: p.bytes(),
    transactionHash: p.bytes(),
    transactionHashId: p.string().references("TransactionHash.id"),
    to: p.bytes(),
  }),
  TransactionHash: p.createTable({
    id: p.string(),
    user: p.string().references("User.id"),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    swaps: p.many("Swap.transactionHashId"),
  }),
  Token: p.createTable({
    id: p.string(),
    // name: p.string(),
    // symbol: p.string(),
    // decimals: p.int(),
  }),
  User: p.createTable({
    id: p.string(),
    transactions: p.many('TransactionHash.user'),
  }),
}));