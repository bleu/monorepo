import { buildBlockExplorerAddressURL } from "@bleu-fi/utils";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Address } from "viem";

import {
  decodePriceCheckerData,
  getPriceCheckerFromAddressAndChain,
} from "#/lib/decode";
import { AllTransactionFromUserQuery } from "#/lib/gql/generated";
import { priceCheckersArgumentsMapping } from "#/lib/priceCheckersMappings";
import { truncateAddress } from "#/utils/truncate";

export function TransactionInfo({
  order,
}: {
  order: AllTransactionFromUserQuery["users"][0]["transactions"][0]["swaps"][0];
}) {
  const priceChecker = getPriceCheckerFromAddressAndChain(
    order.chainId as 5,
    order.priceChecker as Address,
  );

  const expecetedArguments = priceChecker
    ? priceCheckersArgumentsMapping[priceChecker]
    : [];

  const decodedArgs = priceChecker
    ? decodePriceCheckerData(priceChecker, order.priceCheckerData as Address)
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
        {order.tokenIn?.symbol || truncateAddress(order.tokenIn?.id)} for{" "}
        {order.tokenOut?.symbol || truncateAddress(order.tokenOut?.id)}
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
          decodedArgs.map((argument, index) => (
            <div key={index}>
              {expecetedArguments[index].label} :{" "}
              {expecetedArguments[index].convertOutput(
                argument,
                order.tokenOut?.decimals || 18,
              )}
            </div>
          ))}
        {!decodedDataSuccess && (
          <span>Price Checker Data: Error decoding data</span>
        )}
      </div>
    </div>
  );
}
