"use client";

import { buildBlockExplorerTxUrl } from "@bleu-balancer-tools/utils";
import { formatNumber } from "@bleu-balancer-tools/utils/formatNumber";
import { ArrowTopRightIcon, TrashIcon } from "@radix-ui/react-icons";
import cn from "clsx";
import Link from "next/link";
import { formatUnits } from "viem";

import Table from "#/components/Table";
import { AllSwapsQuery } from "#/gql/generated";

import { TransactionStatus } from "../utils/type";

export function OrderTable({ orders }: { orders: AllSwapsQuery["swaps"] }) {
  return (
    <Table color="blue" shade="darkWithBorder">
      <Table.HeaderRow>
        <Table.HeaderCell>Sell Token</Table.HeaderCell>
        <Table.HeaderCell>Sell Amount</Table.HeaderCell>
        <Table.HeaderCell>Buy Token</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>
          <span className="sr-only">Cancel</span>
        </Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body classNames="max-h-80 overflow-y-auto">
        {orders.map((order) => (
          <TableRow key={order.id} order={order} />
        ))}
        <Table.BodyRow>
          <Table.BodyCell>Test</Table.BodyCell>
          <Table.BodyCell>5</Table.BodyCell>
          <Table.BodyCell>Test 2</Table.BodyCell>
          <Table.BodyCell>
            {TransactionStatus.CANCELATION_TO_BE_EXECUTED}
          </Table.BodyCell>
          <Table.BodyCell>
            <CancelButton
              status={TransactionStatus.CANCELATION_TO_BE_EXECUTED}
            />
          </Table.BodyCell>
        </Table.BodyRow>
      </Table.Body>
    </Table>
  );
}

function TableRow({ order }: { order: AllSwapsQuery["swaps"][0] }) {
  const transactionStatus = TransactionStatus.MILKMAN_CREATED;
  const txUrl = buildBlockExplorerTxUrl({
    chainId: order.chainId,
    txHash: order.transactionHash,
  });

  //TODO: use token decimals from the order subgraph
  // const tokenInDecimals = order.tokenIn?.decimals || 18;
  const tokenInDecimals = 18;
  const tokenInAmount = formatUnits(order.tokenAmountIn, tokenInDecimals);
  return (
    <Table.BodyRow key={order.id}>
      <Table.BodyCell>{order.tokenIn?.id}</Table.BodyCell>
      <Table.BodyCell>
        {formatNumber(tokenInAmount, 4, "decimal", "standard", 0.0001)}
      </Table.BodyCell>
      <Table.BodyCell>{order.tokenOut?.id}</Table.BodyCell>
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
        <CancelButton status={transactionStatus} />
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

function CancelButton({ status }: { status: string }) {
  const isTransactionCancelled = /cancel/i.test(status);
  return (
    <button type="button" className="flex items-center">
      <TrashIcon
        className={cn(
          "h-5 w-5",
          !isTransactionCancelled
            ? "text-tomato9 hover:text-tomato10"
            : "text-slate10 hover:text-slate11",
        )}
      />
    </button>
  );
}
