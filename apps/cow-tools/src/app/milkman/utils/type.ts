export enum TransactionStatus {
  ORDER_OVERVIEW = "Order overview",
  ORDER_STRATEGY = "Order strategy",
  ORDER_TWAP = "Order twap",
  ORDER_SUMMARY = "Order summary",
  MILKMAN_CREATED = "Milkman created",
  ORDER_PLACED = "Order placed",
  PARTIALLY_EXECUTED = "Partially executed",
  CANCELED = "Canceled",
  EXECUTED = "Fully executed",
  EXECUTED_AND_CANCELED = "Partially executed and canceled",
}

export enum SwapStatus {
  MILKMAN_CREATED = "Milkman created",
  ORDER_PLACED = "Order placed",
  EXECUTED = "Executed",
  CANCELED = "Canceled",
}
