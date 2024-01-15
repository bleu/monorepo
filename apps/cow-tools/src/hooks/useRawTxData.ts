import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

import {
  AllTransactionArgs,
  TransactionFactory,
} from "#/lib/transactionFactory";

const APP_DATA = "b1e06D696C6B6D617070";

export function useRawTxData() {
  const { safe, sdk } = useSafeAppsSDK();

  const sendTransactions = async (argsArray: AllTransactionArgs[]) => {
    const txs = argsArray.map((arg) => {
      const tx = TransactionFactory.createRawTx(arg.type, arg);
      tx.data += APP_DATA;
      return tx;
    });

    await sdk.txs.send({ txs });
  };

  return { safe, sendTransactions };
}
