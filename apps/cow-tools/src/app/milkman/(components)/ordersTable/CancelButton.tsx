import { TrashIcon } from "@radix-ui/react-icons";

import { useRawTxData } from "#/hooks/useRawTxData";
import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { MilkmanCancelArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { cn } from "#/lib/utils";

export function CancelButton({
  disabled,
  transaction,
}: {
  disabled: boolean;
  transaction: AllTransactionFromUserQuery["users"][0]["transactions"][0];
}) {
  const { sendTransactions } = useRawTxData();

  async function onClick() {
    if (!transaction.swaps) return;
    const transactionsData = transaction.swaps.map(
      (swap) =>
        ({
          type: TRANSACTION_TYPES.MILKMAN_CANCEL,
          contractAddress: swap.orderContract,
          tokenAddressToSell: swap.tokenIn?.id,
          tokenAddressToBuy: swap.tokenOut?.id,
          toAddress: swap.to,
          amount: BigInt(swap.tokenAmountIn),
          priceChecker: swap.priceChecker,
          priceCheckerData: swap.priceCheckerData,
        }) as MilkmanCancelArgs,
    );

    await sendTransactions(transactionsData);
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
