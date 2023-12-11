import { Address, buildBlockExplorerAddressURL } from "@bleu-fi/utils";
import { ArrowTopRightIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { formatUnits } from "viem";

import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { cowTokenList } from "#/utils/cowTokenList";

import { buildAccountCowExplorerUrl, chainId } from "../../utils/cowExplorer";
import { SwapStatus } from "../../utils/type";
import { TokenInfo } from "./TokenInfo";
import { TransactionInfo } from "./TransactionInfo";

export function TableRowOrder({
  order,
  orderStatus,
}: {
  order: AllTransactionFromUserQuery["users"][0]["transactions"][0]["swaps"][0];
  orderStatus: SwapStatus;
}) {
  const cowExplorerUrl = buildAccountCowExplorerUrl({
    chainId: order.chainId as chainId,
    address: order.orderContract as Address,
  });

  const contractExplorerUrl = buildBlockExplorerAddressURL({
    chainId: order.chainId,
    address: order.orderContract as Address,
  })?.url;

  const tokenInDecimals =
    order.tokenIn?.decimals ||
    cowTokenList.find(
      (token) =>
        token.address == order.tokenIn?.id && token.chainId == order.chainId,
    )?.decimals ||
    1;
  const tokenInAmount = formatUnits(order.tokenAmountIn, tokenInDecimals);
  return (
    <Table.BodyRow key={order.id} classNames="bg-slate4">
      <Table.BodyCell>
        <Dialog
          customWidth="w-[100vw] max-w-[550px]"
          content={<TransactionInfo order={order} />}
        >
          <button>
            <InfoCircledIcon className="h-5 w-5 text-blue9 hover:text-blue10" />
          </button>
        </Dialog>
      </Table.BodyCell>
      <Table.BodyCell />
      <Table.BodyCell>
        <TokenInfo
          id={order.tokenIn?.id}
          symbol={order.tokenIn?.symbol}
          chainId={order.chainId}
          amount={tokenInAmount}
        />
      </Table.BodyCell>
      <Table.BodyCell>
        <TokenInfo
          id={order.tokenOut?.id}
          symbol={order.tokenOut?.symbol}
          chainId={order.chainId}
        />
      </Table.BodyCell>
      <Table.BodyCell>
        <div className="flex items-center gap-x-1">
          <span>{orderStatus}</span>
          {cowExplorerUrl && contractExplorerUrl && (
            <Link
              href={
                orderStatus == SwapStatus.MILKMAN_CREATED ||
                orderStatus == SwapStatus.CANCELED
                  ? contractExplorerUrl
                  : cowExplorerUrl
              }
              target="_blank"
            >
              <ArrowTopRightIcon className="hover:text-slate11" />
            </Link>
          )}
        </div>
      </Table.BodyCell>
      <Table.BodyCell>
        <span className="sr-only">Cancel</span>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
