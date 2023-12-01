import { Address } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  getTransactionDetails,
  getTransactionQueue,
  Transaction,
} from "@safe-global/safe-gateway-typescript-sdk";
import { erc20ABI } from "@wagmi/core";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import { PublicClient } from "viem";

import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { milkmanSubgraph } from "#/lib/gql/sdk";
import { MILKMAN_ADDRESS } from "#/lib/transactionFactory";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

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
export interface IMilkmanOrder {
  cowOrders: ICowOrder[];
  hasToken: boolean;
  orderEvent: AllTransactionFromUserQuery["users"][0]["transactions"][0]["swaps"][0];
}

export interface IUserMilkmanTransaction {
  id: string;
  orders: IMilkmanOrder[];
  processed: boolean;
}

const cowApiUrl = "https://api.cow.fi/goerli";

function structureMilkmanTransaction(
  transaction: AllTransactionFromUserQuery["users"][0]["transactions"][0],
  cowOrder: ICowOrder[][],
  hasToken: boolean[],
): IUserMilkmanTransaction {
  return {
    id: transaction.id,
    orders: transaction.swaps.map((swap, index) => ({
      cowOrders: cowOrder[index],
      hasToken: hasToken[index],
      orderEvent: swap,
    })),
    processed: true,
  };
}

async function getProcessedMilkmanTransactions({
  chainId,
  address,
}: {
  chainId: ChainId;
  address: string;
}): Promise<IUserMilkmanTransaction[]> {
  const publicClient = publicClientsFromIds[chainId as ChainId];

  const { users } = await milkmanSubgraph.AllTransactionFromUser({
    user: address,
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

  const hasTokenBySwap = tokenBalances.map((tokenBalance) => tokenBalance > 0);

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

  return users[0]?.transactions.map((transaction, index) =>
    structureMilkmanTransaction(
      transaction,
      cowOrdersByTransaction[index],
      hasTokenByTransaction[index],
    ),
  );
}

async function getQueuedMilkmanTransactions({
  chainId,
  address,
}: {
  chainId: string;
  address: string;
}): Promise<IUserMilkmanTransaction[]> {
  const queuedTransaction = (
    await getTransactionQueue(chainId, address)
  ).results.filter((result) => result.type == "TRANSACTION") as Transaction[];

  const queuedTransactionQueueDetails = await Promise.all(
    queuedTransaction.map((transaction) =>
      getTransactionDetails(chainId, transaction.transaction.id),
    ),
  );
  const queuedMilkmanTransactionQueueDetails =
    queuedTransactionQueueDetails.filter(
      (transactionDetails) =>
        transactionDetails.txData?.dataDecoded?.parameters?.[0].valueDecoded?.some(
          (value) => value.to?.toLowerCase() == MILKMAN_ADDRESS.toLowerCase(),
        ),
    );

  return queuedMilkmanTransactionQueueDetails.map((transactionDetails) => {
    const milkmanTransactions =
      transactionDetails.txData?.dataDecoded?.parameters?.[0].valueDecoded?.filter(
        (value) => value.to?.toLowerCase() == MILKMAN_ADDRESS.toLowerCase(),
      );

    return {
      id: transactionDetails.txId,
      processed: false,
      orders: milkmanTransactions?.map((milkmanTransaction) => ({
        cowOrders: [],
        hasToken: false,
        orderEvent: {
          chainId: Number(chainId),
          tokenAmountIn: milkmanTransaction.dataDecoded?.parameters?.[0].value,
          tokenIn: {
            id: milkmanTransaction.dataDecoded?.parameters?.[1].value,
          },
          tokenOut: {
            id: milkmanTransaction.dataDecoded?.parameters?.[2].value,
          },
          to: milkmanTransaction.dataDecoded?.parameters?.[3].value,
          priceChecker: milkmanTransaction.dataDecoded?.parameters?.[4].value,
          priceCheckerData:
            milkmanTransaction.dataDecoded?.parameters?.[5].value,
          id: "",
          transactionHash: "",
          orderContract: "",
        },
      })) as IMilkmanOrder[],
    };
  });
}

export function useUserMilkmanTransactions() {
  const { safe } = useSafeAppsSDK();
  const [loaded, setLoaded] = useState(false);
  const [transactions, setTransactions] = useState<IUserMilkmanTransaction[]>(
    [],
  );

  useEffect(() => {
    async function loadOrders() {
      const [processedTransactions, queuedTransactions] = await Promise.all([
        getProcessedMilkmanTransactions({
          chainId: safe.chainId as ChainId,
          address: safe.safeAddress,
        }),
        getQueuedMilkmanTransactions({
          chainId: String(safe.chainId),
          address: safe.safeAddress,
        }),
      ]);

      setTransactions([...queuedTransactions, ...processedTransactions]);
      setLoaded(true);
    }

    loadOrders();
  }, [safe]);

  return { transactions, loaded };
}

export async function getTokenBalance(
  tokenAddress: Address,
  userAddress: Address,
  publicClient: PublicClient,
) {
  return publicClient.readContract({
    address: tokenAddress,
    abi: erc20ABI,
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
