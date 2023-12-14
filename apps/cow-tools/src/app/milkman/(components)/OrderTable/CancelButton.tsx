import { TrashIcon } from "@radix-ui/react-icons";

import { useRawTxData } from "#/hooks/useRawTxData";
import { IUserMilkmanTransaction } from "#/hooks/useUserMilkmanTransactions";
import { MilkmanCancelArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { cn } from "#/lib/utils";

export function CancelButton({
  disabled,
  transaction,
}: {
  disabled: boolean;
  transaction: IUserMilkmanTransaction;
}) {
  const { sendTransactions } = useRawTxData();

  async function onClick() {
    if (!transaction.orders.length) return;
    const cancelTransactionsData = transaction.orders.map(
      (order) =>
        ({
          type: TRANSACTION_TYPES.MILKMAN_CANCEL,
          contractAddress: order.orderEvent.orderContract,
          tokenAddressToSell: order.orderEvent.tokenIn?.address,
          tokenAddressToBuy: order.orderEvent.tokenOut?.address,
          toAddress: order.orderEvent.to,
          amount: BigInt(order.orderEvent.tokenAmountIn),
          priceChecker: order.orderEvent.priceChecker,
          priceCheckerData: order.orderEvent.priceCheckerData,
        }) as MilkmanCancelArgs,
    );

    await sendTransactions(cancelTransactionsData);
  }
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center"
      disabled={disabled}
    >
      <TrashIcon
        className={cn(
          "h-5 w-5",
          disabled ? "text-slate10" : "text-tomato9 hover:text-tomato10",
        )}
      />
    </button>
  );
}
