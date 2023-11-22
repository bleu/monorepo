import { buildBlockExplorerTxUrl } from "@bleu-fi/utils";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import {
  ArrowDownIcon,
  ArrowTopRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { formatUnits } from "viem";

import Table from "#/components/Table";
import { ICowOrder } from "#/hooks/useUserMilkmanTransactions";
import { AllTransactionFromUserQuery } from "#/lib/gql/generated";

import { SwapStatus, TransactionStatus } from "../../utils/type";
import { CancelButton } from "./CancelButton";
import { TableRowOrder } from "./TableRowOrder";
import { TokenInfo } from "./TokenInfo";

export function TableRowTransaction({
  transaction,
  hasToken,
  cowOrders,
}: {
  transaction: AllTransactionFromUserQuery["users"][0]["transactions"][0];
  hasToken?: boolean[];
  cowOrders?: ICowOrder[][];
}) {
  function getSwapStatus(hasToken?: boolean, cowOrders?: ICowOrder[]) {
    if (!cowOrders || hasToken === undefined) {
      return SwapStatus.MILKMAN_CREATED;
    }

    const anyOrderWasExecuted = cowOrders.some(
      (order) => order.status == "fulfilled",
    );

    if (anyOrderWasExecuted) {
      return SwapStatus.EXECUTED;
    }

    if (!anyOrderWasExecuted && !hasToken) {
      return SwapStatus.CANCELED;
    }

    if (cowOrders.length > 0 && hasToken) {
      return SwapStatus.ORDER_PLACED;
    }

    return SwapStatus.MILKMAN_CREATED;
  }

  function getTransactionStatus(swapStatus: SwapStatus[]) {
    if (swapStatus.every((status) => status === SwapStatus.CANCELED)) {
      return TransactionStatus.CANCELED;
    }
    if (swapStatus.every((status) => status === SwapStatus.EXECUTED)) {
      return TransactionStatus.EXECUTED;
    }

    if (
      swapStatus.every(
        (status) =>
          status === SwapStatus.CANCELED || status === SwapStatus.EXECUTED,
      )
    ) {
      return TransactionStatus.EXECUTED_AND_CANCELED;
    }
    if (swapStatus.some((status) => status === SwapStatus.EXECUTED)) {
      return TransactionStatus.PARTIALLY_EXECUTED;
    }

    const allOrdersPlaced = swapStatus.every(
      (status) => status === SwapStatus.ORDER_PLACED,
    );

    if (allOrdersPlaced) {
      return TransactionStatus.ORDER_PLACED;
    }

    return TransactionStatus.MILKMAN_CREATED;
  }

  const swapStatus = transaction.swaps.map((swap, i) =>
    getSwapStatus(hasToken?.[i], cowOrders?.[i]),
  );
  const transactionStatus = getTransactionStatus(swapStatus);
  const txUrl = buildBlockExplorerTxUrl({
    chainId: transaction.swaps[0].chainId,
    txHash: transaction.id,
  });

  const [showOrdersRows, setShowOrdersRows] = useState(false);

  const equalTokensIn = transaction.swaps.every(
    (swap) => swap.tokenIn?.id == transaction.swaps[0].tokenIn?.id,
  );

  const equalTokensOut = transaction.swaps.every(
    (swap) => swap.tokenOut?.id == transaction.swaps[0].tokenOut?.id,
  );

  const decimalsTokenIn = transaction.swaps[0].tokenIn?.decimals || 18;

  const totalAmountTokenIn = transaction.swaps.reduce(
    (acc, swap) =>
      acc + Number(formatUnits(swap.tokenAmountIn, decimalsTokenIn)),
    0,
  );

  return (
    <>
      <Table.BodyRow key={transaction.id}>
        <Table.BodyCell>
          <button onClick={() => setShowOrdersRows(!showOrdersRows)}>
            {showOrdersRows ? (
              <ArrowUpIcon className="h-5 w-5 text-blue9 hover:text-blue10" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-blue9 hover:text-blue10" />
            )}
          </button>
        </Table.BodyCell>
        <Table.BodyCell>
          {equalTokensIn ? (
            <TokenInfo
              id={transaction.swaps[0].tokenIn?.id}
              symbol={transaction.swaps[0].tokenIn?.symbol}
              chainId={transaction.swaps[0].chainId}
            />
          ) : (
            "Multiple Tokens"
          )}
        </Table.BodyCell>
        <Table.BodyCell>
          {equalTokensIn
            ? formatNumber(totalAmountTokenIn, 4, "decimal", "standard", 0.0001)
            : "Multiple Tokens"}
        </Table.BodyCell>
        <Table.BodyCell>
          {equalTokensOut ? (
            <TokenInfo
              id={transaction.swaps[0].tokenOut?.id}
              symbol={transaction.swaps[0].tokenOut?.symbol}
              chainId={transaction.swaps[0].chainId}
            />
          ) : (
            "Multiple Tokens"
          )}
        </Table.BodyCell>
        <Table.BodyCell>
          <div className="flex items-center gap-x-1">
            <span>{transactionStatus}</span>
            {txUrl && (
              <Link href={txUrl} target="_blank">
                <ArrowTopRightIcon className="hover:text-slate11" />
              </Link>
            )}
          </div>
        </Table.BodyCell>
        <Table.BodyCell>
          <CancelButton
            disabled={[
              TransactionStatus.EXECUTED,
              TransactionStatus.CANCELED,
              TransactionStatus.EXECUTED_AND_CANCELED,
            ].includes(transactionStatus)}
          />
        </Table.BodyCell>
      </Table.BodyRow>
      {showOrdersRows &&
        transaction.swaps.map((order, index) => (
          <TableRowOrder
            key={order.id}
            order={order}
            orderStatus={swapStatus[index]}
          />
        ))}
    </>
  );
}
