import { Network } from "@bleu-fi/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";

import { TransactionStatus } from "#/app/milkman/utils/type";
import { Button } from "#/components";
import { useRawTxData } from "#/hooks/useRawTxData";
import { priceCheckersArgumentsMapping } from "#/lib/priceCheckersMappings";
import { MILKMAN_ADDRESS, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { PRICE_CHECKERS } from "#/lib/types";
import { truncateAddress } from "#/utils/truncate";

import { FormFooter } from "./Footer";

export function OrderSummary({
  data,
  handleBack,
  network,
}: {
  data: FieldValues;
  handleBack: () => void;
  network: Network;
}) {
  const fieldsToDisplay = [
    { label: "Token to sell", key: "tokenSell" },
    { label: "Token to buy", key: "tokenBuy" },
    { label: "Amount to sell", key: "tokenSellAmount" },
    { label: "Price checker", key: "priceChecker" },
    { label: "Token to buy minimum amount", key: "tokenBuyMinimumAmount" },
    { label: "Valid from", key: "validFrom" },
    ...priceCheckersArgumentsMapping[data.priceChecker as PRICE_CHECKERS].map(
      (arg) => ({
        label: arg.label,
        key: arg.name,
      }),
    ),
  ];

  const router = useRouter();

  const { sendTransactions } = useRawTxData();

  async function handleButtonClick() {
    const sellAmountBigInt = BigInt(
      Number(data.tokenSellAmount) * 10 ** data.tokenSell.decimals,
    );
    const priceCheckersArgs = priceCheckersArgumentsMapping[
      data.priceChecker as PRICE_CHECKERS
    ].map((arg) => arg.convertInput(data[arg.name], data.tokenBuy.decimals));

    await sendTransactions([
      {
        type: TRANSACTION_TYPES.ERC20_APPROVE,
        tokenAddress: data.tokenSell.address,
        spender: MILKMAN_ADDRESS,
        amount: sellAmountBigInt,
      },
      {
        type: TRANSACTION_TYPES.MILKMAN_ORDER,
        tokenAddressToSell: data.tokenSell.address,
        tokenAddressToBuy: data.tokenBuy.address,
        toAddress: data.receiverAddress,
        amount: sellAmountBigInt,
        priceChecker: data.priceChecker,
        args: priceCheckersArgs,
      },
    ]);
    router.push(`/milkman/${network}`);
  }

  return (
    <div>
      <div className="font-semibold text-2xl flex justify-between">
        Order #1 - {truncateAddress(data.tokenSell.symbol)} for{" "}
        {data.tokenBuy.symbol}
        <Button
          type="button"
          className="bg-transparent border-0 hover:bg-transparent"
          onClick={handleBack}
        >
          <Pencil1Icon className="text-amber9" />
        </Button>
      </div>
      <hr className="mb-2" />
      <div className="flex flex-col">
        {fieldsToDisplay.map((field) => {
          const value = data[field.key];
          switch (field.key) {
            case "tokenSell":
              return (
                value && (
                  <span key={field.key}>
                    {field.label}: {value.symbol} (
                    {truncateAddress(data.tokenSell.address)})
                  </span>
                )
              );
            case "tokenBuy":
              return (
                value && (
                  <span key={field.key}>
                    {field.label}: {value.symbol} (
                    {truncateAddress(data.tokenBuy.address)})
                  </span>
                )
              );
            case "addressesPriceFeeds":
              return (
                value && (
                  <span key={field.key}>
                    {field.label}:{" "}
                    {value.map((address: string) => truncateAddress(address))}
                  </span>
                )
              );

            case "revertPriceFeeds":
              return (
                value && (
                  <span key={field.key}>
                    {field.label}: {value.toString()}
                  </span>
                )
              );
            default:
              return (
                value && (
                  <span key={field.key}>
                    {field.label}: {value}
                  </span>
                )
              );
          }
        })}
      </div>
      <div className="mt-5">
        <FormFooter
          transactionStatus={TransactionStatus.ORDER_SUMMARY}
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
}
