import { UserBalanceOpKind } from "#/lib/internal-balance-helper";

interface IOperationKind {
  operationKind: UserBalanceOpKind | undefined;
}

export function TransactionModal({ operationKind }: IOperationKind) {
  function getModalTitle({ operationKind }: IOperationKind) {
    switch (operationKind) {
      case UserBalanceOpKind.DEPOSIT_INTERNAL:
        return "Deposit to";
      case UserBalanceOpKind.WITHDRAW_INTERNAL:
        return "Withdraw from";
      case UserBalanceOpKind.TRANSFER_INTERNAL:
        return "Transfer to";
      default:
        return "";
    }
  }

  const modalTitle = getModalTitle({ operationKind });

  return (
    <div className="mx-24">
      <span>{modalTitle} Internal Balance</span>
    </div>
  );
}
