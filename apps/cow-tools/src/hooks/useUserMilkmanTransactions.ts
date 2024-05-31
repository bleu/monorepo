import { Address } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  getTransactionDetails,
  getTransactionQueue,
  Transaction,
  TransactionDetails,
} from "@safe-global/safe-gateway-typescript-sdk";
import { erc20ABI } from "@wagmi/core";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import { PublicClient } from "viem";

import { getCowOrders, ICowOrder } from "#/lib/cow/fetchCowOrder";
import { fetchTokenInfo } from "#/lib/fetchTokenInfo";
import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { milkmanSubgraph } from "#/lib/gql/sdk";
import { MILKMAN_ADDRESS } from "#/lib/transactionFactory";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";
import { retryAsyncOperation } from "#/utils/retryAsyncOperation";

gql(`
  query AllTransactionFromUser ($user: String!) {
    users(
      where : { id : $user}
    ) {
      id
      transactions(orderBy:"blockNumber", orderDirection:"desc") {
        id
        blockNumber
        blockTimestamp
        swaps {
          id
          chainId
          tokenAmountIn
          priceChecker
          orderContract
          priceCheckerData
          to
          tokenIn {
            address
            name
            symbol
            decimals
          }
          tokenOut {
            address
            name
            symbol
            decimals
          }
        }
      }
    }
  }
`);

export interface IMilkmanOrder {
  cowOrders: ICowOrder[];
  hasToken: boolean;
  orderEvent: AllTransactionFromUserQuery["users"][0]["transactions"][0]["swaps"][0];
}

export interface IUserMilkmanTransaction {
  id: string;
  blockTimestamp: number;
  orders: IMilkmanOrder[];
  processed: boolean;
}

function structureMilkmanTransaction(
  transaction: AllTransactionFromUserQuery["users"][0]["transactions"][0],
  cowOrder: ICowOrder[][],
  hasToken: boolean[]
): IUserMilkmanTransaction {
  return {
    id: transaction.id,
    blockTimestamp: transaction.blockTimestamp,
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
    user: `${address}-${chainId}`,
  });

  if (users.length === 0) return [] as IUserMilkmanTransaction[];

  const swapsLenByTransaction = users[0]?.transactions.map(
    (transaction) => transaction.swaps.length
  );

  const orderContractsByTransaction = users[0]?.transactions.map(
    (transaction) => transaction.swaps.map((swap) => swap.orderContract)
  );

  const orderContractsBySwap = ([] as string[]).concat(
    ...orderContractsByTransaction
  );

  const tokenAddressesByTransactions = users[0]?.transactions.map(
    (transaction) => transaction.swaps.map((swap) => swap.tokenIn?.address)
  ) as (Address | undefined)[][];

  const tokenAddressesBySwap = ([] as (Address | undefined)[]).concat(
    ...tokenAddressesByTransactions
  );

  const tokenBalances = (await Promise.all(
    orderContractsBySwap.map((orderContract, index) => {
      if (!tokenAddressesBySwap[index]) {
        return 0;
      }
      return getTokenBalance(
        tokenAddressesBySwap[index] as Address,
        orderContract as Address,
        publicClient
      );
    })
  )) as number[];

  const hasTokenBySwap = tokenBalances.map((tokenBalance) => tokenBalance > 0);

  const cowOrdersBySwap = (await Promise.all(
    orderContractsBySwap.map((orderContract) =>
      retryAsyncOperation<ICowOrder[]>(
        async () => {
          return getCowOrders(orderContract as Address, chainId);
        },
        5,
        1000
      )
    )
  )) as ICowOrder[][];

  if (cowOrdersBySwap.some((cowOrders) => cowOrders === null)) {
    throw new Error("Failed to fetch cow orders");
  }

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
      hasTokenByTransaction[index]
    )
  );
}

async function fetchToken(tokenAddress: Address, chainId: ChainId) {
  const [symbol, name, decimals] = await Promise.all([
    fetchTokenInfo<string>(tokenAddress, chainId, "symbol").catch(() => ""),
    fetchTokenInfo<string>(tokenAddress, chainId, "name").catch(() => ""),
    fetchTokenInfo<number>(tokenAddress, chainId, "decimals").catch(() => 1),
  ]);

  return {
    address: tokenAddress,
    symbol,
    name,
    decimals,
  };
}

function getMilkmanTransactionsFromTransactionsDetails(
  transactionDetails: TransactionDetails
) {
  return (
    transactionDetails.txData?.dataDecoded?.parameters?.[0].valueDecoded?.filter(
      (value) => value.to?.toLowerCase() == MILKMAN_ADDRESS.toLowerCase()
    ) || []
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
  ).results.filter((result) => {
    if (result.type != "TRANSACTION") return false;
    if (!(`methodName` in result.transaction.txInfo)) return false;
    return result.transaction.txInfo.methodName === "multiSend";
  }) as Transaction[];

  const queuedTransactionQueueDetails = await Promise.all(
    queuedTransaction.map((transaction) =>
      getTransactionDetails(chainId, transaction.transaction.id)
    )
  );
  const queuedMilkmanTransactionQueueDetails =
    queuedTransactionQueueDetails.filter((transactionDetails) =>
      transactionDetails.txData?.dataDecoded?.parameters?.[0].valueDecoded?.some(
        (value) => value.to?.toLowerCase() == MILKMAN_ADDRESS.toLowerCase()
      )
    );

  const [tokensIn, tokensOut] = await Promise.all(
    [1, 2].map((index) =>
      Promise.all(
        queuedMilkmanTransactionQueueDetails.map((transactionDetails) =>
          Promise.all(
            getMilkmanTransactionsFromTransactionsDetails(
              transactionDetails
            ).map((milkmanTransaction) =>
              fetchToken(
                milkmanTransaction.dataDecoded?.parameters?.[index]
                  .value as Address,
                Number(chainId) as ChainId
              )
            )
          )
        )
      )
    )
  );

  return queuedMilkmanTransactionQueueDetails.map(
    (transactionDetails, transactionIndex) => {
      const milkmanTransactions =
        getMilkmanTransactionsFromTransactionsDetails(transactionDetails);

      return {
        id: transactionDetails.txId,
        blockTimestamp: 0,
        processed: false,
        orders: milkmanTransactions?.map((milkmanTransaction, milkmanIndex) => {
          return {
            cowOrders: [],
            hasToken: false,
            orderEvent: {
              chainId: Number(chainId),
              tokenAmountIn:
                milkmanTransaction.dataDecoded?.parameters?.[0].value,
              tokenIn: tokensIn[transactionIndex][milkmanIndex],
              tokenOut: tokensOut[transactionIndex][milkmanIndex],
              to: milkmanTransaction.dataDecoded?.parameters?.[3].value,
              priceChecker:
                milkmanTransaction.dataDecoded?.parameters?.[4].value,
              priceCheckerData:
                milkmanTransaction.dataDecoded?.parameters?.[5].value,
              id: "",
              orderContract: "",
            },
          };
        }) as IMilkmanOrder[],
      };
    }
  );
}

export function useUserMilkmanTransactions() {
  const { safe } = useSafeAppsSDK();
  const [loaded, setLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(false);
  const [transactions, setTransactions] = useState<IUserMilkmanTransaction[]>(
    []
  );

  const reload = ({ showSpinner }: { showSpinner: boolean }) => {
    setLoaded(!showSpinner);
    setRetryCount(retryCount + 1);
  };

  useEffect(() => {
    async function loadOrders() {
      try {
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
        setError(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError(true);
      }
      setLoaded(true);
    }

    loadOrders();
  }, [safe, retryCount]);

  return { transactions, loaded, error, reload };
}

export async function getTokenBalance(
  tokenAddress: Address,
  userAddress: Address,
  publicClient: PublicClient
) {
  return publicClient.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [userAddress],
  });
}
