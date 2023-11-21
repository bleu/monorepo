import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";

import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { sdk } from "#/lib/gql/sdk";

gql(`
  query AllTransactionFromUser ($user: String!) {
    users(
      where : { id : $user}
    ) {
      id
      transactions {
        id
        blockNumber
        blockTimestamp
        swaps {
          id
          chainId
          transactionHash
          tokenAmountIn
          priceChecker
          orderContract
          priceCheckerData
          tokenIn {
            id
            name
            symbol
            decimals
          }
          tokenOut {
            id
            name
            symbol
            decimals
          }
        }
      }
    }
  }
`);

export function useUserMilkmanTransactions() {
  const { safe } = useSafeAppsSDK();
  const [loaded, setLoaded] = useState(false);
  const [transactions, setTransactions] =
    useState<AllTransactionFromUserQuery["users"][0]["transactions"]>();

  useEffect(() => {
    async function loadOrders() {
      const { users } = await sdk.AllTransactionFromUser({
        user: safe.safeAddress,
      });

      setTransactions(users[0]?.transactions);
      setLoaded(true);
    }

    loadOrders();
  }, [safe]);

  return { transactions, loaded };
}
