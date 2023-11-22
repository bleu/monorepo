import { Address } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import { createPublicClient, http, PublicClient } from "viem";
import { goerli } from "viem/chains";

import { erc20Abi } from "#/lib/abis/erc20";
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
          to
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

export interface ICowOrder {
  sellToken: Address;
  buyToken: Address;
  receiver: Address;
  sellAmount: number;
  buyAmount: number;
  validTo: number;
  feeAmount: number;
  kind: string;
  partiallyFillable: boolean;
  sellTokenBalance: string;
  buyTokenBalance: string;
  from: Address;
  executedSellAmount?: number;
  executedSellAmountBeforeFees?: number;
  executedBuyAmount?: number;
  executedFeeAmount?: number;
  status: string;
}

const cowApiUrl = "https://api.cow.fi/goerli";

export function useUserMilkmanTransactions() {
  const { safe } = useSafeAppsSDK();
  const [loaded, setLoaded] = useState(false);
  const [transactions, setTransactions] =
    useState<AllTransactionFromUserQuery["users"][0]["transactions"]>();
  const [cowOrders, setOrders] = useState<ICowOrder[][][]>();
  const [hasToken, setHasToken] = useState<boolean[][]>();

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });

  useEffect(() => {
    async function loadOrders() {
      const { users } = await sdk.AllTransactionFromUser({
        user: safe.safeAddress,
      });

      const swapsLenByTransaction = users[0]?.transactions.map(
        (transaction) => transaction.swaps.length,
      );

      const orderContractsByTransaction = users[0]?.transactions.map(
        (transaction) => transaction.swaps.map((swap) => swap.orderContract),
      );

      const orderContractsBySwap = ([] as string[]).concat(
        ...orderContractsByTransaction,
      );

      const tokenAddressesByTransactions = users[0]?.transactions.map(
        (transaction) => transaction.swaps.map((swap) => swap.tokenIn?.id),
      ) as (Address | undefined)[][];

      const tokenAddressesBySwap = ([] as (Address | undefined)[]).concat(
        ...tokenAddressesByTransactions,
      );

      const tokenBalances = (await Promise.all(
        orderContractsBySwap.map((orderContract, index) => {
          if (!tokenAddressesBySwap[index]) {
            return 0;
          }
          return getTokenBalance(
            tokenAddressesBySwap[index] as Address,
            orderContract as Address,
            publicClient,
          );
        }),
      )) as number[];

      const hasTokenBySwap = tokenBalances.map(
        (tokenBalance) => tokenBalance > 0,
      );

      const cowOrdersBySwap = await Promise.all(
        orderContractsBySwap.map((orderContract) =>
          getCowOrders(orderContract as Address),
        ),
      );

      const hasTokenByTransaction = [] as boolean[][];
      const cowOrdersByTransaction = [] as ICowOrder[][][];

      swapsLenByTransaction.forEach((swapsLen) => {
        hasTokenByTransaction.push(hasTokenBySwap.splice(0, swapsLen));
        cowOrdersByTransaction.push(cowOrdersBySwap.splice(0, swapsLen));
      });

      setOrders(cowOrdersByTransaction);
      setHasToken(hasTokenByTransaction);
      setTransactions(users[0]?.transactions);
      setLoaded(true);
    }

    loadOrders();
  }, [safe]);

  return { cowOrders, hasToken, transactions, loaded };
}

export async function getTokenBalance(
  tokenAddress: Address,
  userAddress: Address,
  publicClient: PublicClient,
) {
  return publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress],
  });
}

export async function getCowOrders(userAddress: Address): Promise<ICowOrder[]> {
  return fetch(`${cowApiUrl}/api/v1/account/${userAddress}/orders`, {
    headers: {
      Accept: "application/json",
    },
  }).then((response) => response.json() as Promise<ICowOrder[]>);
}
