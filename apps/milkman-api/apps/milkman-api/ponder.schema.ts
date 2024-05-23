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
    Transaction: p.bytes(),
    TransactionId: p.string().references("Transaction.id"),
    to: p.bytes(),
  }),
  Transaction: p.createTable({
    id: p.string(),
    chainId: p.int(),
    user: p.string().references("User.id"),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    swaps: p.many("Swap.TransactionId"),
  }),
  Token: p.createTable({
    id: p.string(),
    address: p.bytes(),
    chainId: p.int(),
    name: p.string(),
    symbol: p.string(),
    decimals: p.int(),
  }),
  User: p.createTable({
    id: p.string(),
    address: p.string(),
    chainId: p.int(),
    transactions: p.many("Transaction.user"),
  }),
}));
