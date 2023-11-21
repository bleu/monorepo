import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";

import { AllSwapsFromUserQuery } from "#/lib/gql/generated";
import { sdk } from "#/lib/gql/sdk";

gql(`
  query AllSwapsFromUser ($user:String!) {
    swaps(where:{user:$user}) {
      id
      chainId
      transactionHash
      tokenAmountIn
      priceChecker
      priceCheckerData
      user {
        id
      }
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
`);

export function useUserOrders() {
  const { safe } = useSafeAppsSDK();
  const [loaded, setLoaded] = useState(false);
  const [orders, setOrders] = useState<AllSwapsFromUserQuery["swaps"]>([]);

  useEffect(() => {
    async function loadOrders() {
      const { swaps: orders } = await sdk.AllSwapsFromUser({
        user: safe.safeAddress,
      });

      setOrders(orders);
      setLoaded(true);
    }

    loadOrders();
  }, [safe]);

  return { orders, loaded };
}
