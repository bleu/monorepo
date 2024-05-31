import { buildBlockExplorerAddressURL } from "@bleu/utils";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Address } from "viem";

import {
  decodePriceCheckerData,
  getExpectedArgumentsFromPriceChecker,
  getPriceCheckerFromAddressAndChain,
} from "#/lib/decode";
import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { ChainId } from "#/utils/chainsPublicClients";
import { truncateAddress } from "#/utils/truncate";

export function TransactionInfo({
  order,
}: {
  order: AllTransactionFromUserQuery["users"][0]["transactions"][0]["swaps"][0];
}) {
  const priceChecker = getPriceCheckerFromAddressAndChain(
    order.chainId as ChainId,
    order.priceChecker as Address
  );

  const expecetedArguments = priceChecker
    ? getExpectedArgumentsFromPriceChecker(
        priceChecker,
        order.priceCheckerData as `0x${string}`,
        order.chainId as ChainId
      )
    : [];

  const decodedArgs = priceChecker
    ? decodePriceCheckerData(
        priceChecker,
        order.priceCheckerData as `0x${string}`,
        order.chainId as ChainId
      )
    : [];

  const priceCheckerExplorerUrl = buildBlockExplorerAddressURL({
    chainId: order.chainId,
    address: order.priceChecker as Address,
  });

  const decodedDataSuccess = decodedArgs && expecetedArguments;
  return (
    <div className="text-white">
      <div className="font-semibold text-2xl flex justify-between">
        Price Checker Data -{" "}
        {order.tokenIn?.symbol || truncateAddress(order.tokenIn?.address)} for{" "}
        {order.tokenOut?.symbol || truncateAddress(order.tokenOut?.address)}
      </div>
      <hr className="mb-2" />
      <div className="flex flex-col">
        <div className="flex items-center gap-x-1">
          <span>
            Price Checker: {priceChecker || "Not found"}{" "}
            {`(${truncateAddress(order.priceChecker as Address)})`}
          </span>
          {priceCheckerExplorerUrl && (
            <Link href={priceCheckerExplorerUrl.url} target="_blank">
              <ArrowTopRightIcon className="hover:text-slate11" />
            </Link>
          )}
        </div>
        {decodedDataSuccess &&
          decodedArgs.map((argument, index) => {
            const output =
              expecetedArguments[index].convertOutput?.(
                argument,
                order.tokenOut?.decimals || 18
              ) || String(argument);
            return (
              <div key={index} className="max-w-prose text-base">
                {expecetedArguments[index].label} : {output}
              </div>
            );
          })}
        {!decodedDataSuccess && (
          <span>Price Checker Data: Error decoding data</span>
        )}
      </div>
    </div>
  );
}
