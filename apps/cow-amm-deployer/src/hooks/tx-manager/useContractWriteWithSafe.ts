import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useMutation } from "@tanstack/react-query";

import {
  AllTransactionArgs,
  TransactionFactory,
} from "#/lib/transactionFactory";

export function useContractWriteWithSafe() {
  const { mutate, mutateAsync, ...result } = useMutation({
    mutationFn: (txs: AllTransactionArgs[]) => {
      return sendTransactions(txs);
    },
    mutationKey: ["writeContract"],
  });
  const { sdk } = useSafeAppsSDK();

  const sendTransactions = async (argsArray: AllTransactionArgs[]) => {
    const txs = argsArray.map((arg) => {
      return TransactionFactory.createRawTx(arg.type, arg);
    });
    const { safeTxHash } = await sdk.txs.send({ txs });
    return safeTxHash as `0x${string}`;
  };

  return {
    ...result,
    writeContractWithSafe: mutate,
    writeContractWithSafeAsync: mutateAsync,
  };
}
