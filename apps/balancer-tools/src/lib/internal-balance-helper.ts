export enum UserBalanceOpKind {
  DEPOSIT_INTERNAL = 0,
  WITHDRAW_INTERNAL = 1,
  TRANSFER_INTERNAL = 2,
  TRANSFER_EXTERNAL = 3,
}

export enum operationKindType {
  "deposit" = UserBalanceOpKind.DEPOSIT_INTERNAL,
  "withdraw" = UserBalanceOpKind.WITHDRAW_INTERNAL,
  "transfer" = UserBalanceOpKind.TRANSFER_INTERNAL,
}
