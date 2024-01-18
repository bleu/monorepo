import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

import {
  AllTransactionArgs,
  TransactionFactory,
} from "#/lib/transactionFactory";

const APP_DATA =
  "B1E06D696C6B6D617070B1E06D696C6B6D617070B1E06D696C6B6D6170700000"; // fixed data used to track milkmapp transactions on CoW orderbook

export function useRawTxData() {
  const { safe, sdk } = useSafeAppsSDK();

  const sendTransactions = async (argsArray: AllTransactionArgs[]) => {
    const txs = argsArray.map((arg) => {
      return TransactionFactory.createRawTx(arg.type, arg);
    });

    txs[txs.length - 1].data += APP_DATA; // this data doesn't affect the transaction, we just need to add it once to check it on the milkman bot
    await sdk.txs.send({ txs });
  };

  return { safe, sendTransactions };
}
