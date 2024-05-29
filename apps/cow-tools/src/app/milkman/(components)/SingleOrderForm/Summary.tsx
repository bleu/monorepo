import { NetworkChainId, networkFor } from "@bleu/utils";
import { formatDateToLocalDatetime } from "@bleu/utils/date";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";

import { TransactionStatus } from "#/app/milkman/utils/type";
import { Button } from "#/components";
import { ClickToCopy } from "#/components/ClickToCopy";
import { useRawTxData } from "#/hooks/useRawTxData";
import { priceCheckersArgumentsMapping } from "#/lib/priceCheckersMappings";
import {
  ERC20ApproveArgs,
  MILKMAN_ADDRESS,
  MilkmanOrderArgs,
  TRANSACTION_TYPES,
} from "#/lib/transactionFactory";
import { PRICE_CHECKERS } from "#/lib/types";
import { truncateAddress } from "#/utils/truncate";

import { FormFooter } from "./Footer";
import { TWAP_DELAY_OPTIONS, TwapDelayValues } from "./Twap";

export function OrderSummaryList({
  orders,
  handleEdit,
  chainId,
  setCurrentOrderToEdit,
}: {
  orders: FieldValues[];
  handleEdit: () => void;
  chainId?: NetworkChainId;
  setCurrentOrderToEdit: (index: number) => void;
}) {
  const router = useRouter();

  const { sendTransactions } = useRawTxData();

  function createRawTransaction(data: FieldValues) {
    const sellAmountBigInt = BigInt(
      Number(data.tokenSellAmount) * 10 ** data.tokenSell.decimals,
    );
    const priceCheckersArgs = priceCheckersArgumentsMapping[
      data.priceChecker as PRICE_CHECKERS
    ].map(
      (arg) =>
        arg.convertInput?.(data[arg.name], data.tokenBuy.decimals) ||
        data[arg.name],
    );

    const ordersNumber = data.isTwapNeeded ? data.numberOfOrders : 1;
    const delay = data.isTwapNeeded
      ? TwapDelayValues[data.delay as TWAP_DELAY_OPTIONS]
      : 0;
    const validFrom =
      !data.isValidFromNeeded && data.isTwapNeeded
        ? formatDateToLocalDatetime(new Date())
        : data.validFrom;

    return [
      {
        type: TRANSACTION_TYPES.ERC20_APPROVE,
        tokenAddress: data.tokenSell.address,
        spender: MILKMAN_ADDRESS,
        amount: sellAmountBigInt,
      } as ERC20ApproveArgs,
      ...[...Array(ordersNumber).keys()].map((index) => {
        return {
          type: TRANSACTION_TYPES.MILKMAN_ORDER,
          tokenAddressToSell: data.tokenSell.address,
          tokenAddressToBuy: data.tokenBuy.address,
          toAddress: data.receiverAddress,
          amount: sellAmountBigInt / BigInt(ordersNumber),
          priceChecker: data.priceChecker,
          validFrom: validFrom,
          isValidFromNeeded: data.isValidFromNeeded || data.isTwapNeeded,
          args: priceCheckersArgs,
          twapDelay: index * delay,
          chainId: chainId,
        } as MilkmanOrderArgs;
      }),
    ];
  }

  async function handleButtonClick() {
    const rawTransactions = orders.map((order) => createRawTransaction(order));

    await sendTransactions(rawTransactions.flat());
    router.push(`/milkman/${networkFor(chainId)}`);
  }
  return (
    <div>
      <div className="flex flex-col gap-x-2">
        {orders.map((order, index) => (
          <OrderSummary
            key={index}
            data={order}
            handleEdit={handleEdit}
            index={index}
            setCurrentOrderToEdit={setCurrentOrderToEdit}
          />
        ))}
      </div>
      <div className="mt-5">
        <FormFooter
          transactionStatus={TransactionStatus.ORDER_SUMMARY}
          onContinue={handleButtonClick}
          onAddOneMore={() => {
            handleEdit();
            setCurrentOrderToEdit(orders.length);
          }}
        />
      </div>
    </div>
  );
}

function OrderSummary({
  data,
  handleEdit,
  index,
  setCurrentOrderToEdit,
}: {
  data: FieldValues;
  handleEdit: () => void;
  index: number;
  setCurrentOrderToEdit: (index: number) => void;
}) {
  const fieldsToDisplay = [
    { label: "Token to sell", key: "tokenSell" },
    { label: "Token to buy", key: "tokenBuy" },
    { label: "Amount to sell", key: "tokenSellAmount" },
    { label: "Price checker", key: "priceChecker" },
    { label: "Token to buy minimum amount", key: "tokenBuyMinimumAmount" },
    data.isValidFromNeeded && {
      label: "Valid from",
      key: "validFrom",
    },
    data.isTwapNeeded && {
      label: "Number of TWAP orders",
      key: "numberOfOrders",
    },
    data.isTwapNeeded && { label: "TWAP delay", key: "delay" },
    ...priceCheckersArgumentsMapping[data.priceChecker as PRICE_CHECKERS].map(
      (arg) =>
        data.priceChecker != PRICE_CHECKERS.META && {
          label: arg.label,
          key: arg.name,
        },
    ),
  ];

  return (
    <div>
      <div className="font-semibold text-2xl flex justify-between">
        Order #{index + 1} - {truncateAddress(data.tokenSell.symbol)} for{" "}
        {data.tokenBuy.symbol}
        <Button
          type="button"
          className="bg-transparent border-0 hover:bg-transparent"
          onClick={() => {
            setCurrentOrderToEdit(0);
            handleEdit();
          }}
        >
          <Pencil1Icon className="text-amber9" />
        </Button>
      </div>
      <hr className="mb-2" />
      <div className="flex flex-col">
        {fieldsToDisplay.map((field) => {
          const value = data[field.key];
          if (!value) return null;
          switch (field.key) {
            case "tokenSell":
              return (
                <div className="flex flex-row gap-x-2" key={field.key}>
                  {field.label}:
                  <ClickToCopy text={data.tokenSell.address} key={field.key}>
                    {truncateAddress(data.tokenSell.address)}
                  </ClickToCopy>
                </div>
              );
            case "tokenBuy":
              return (
                <div className="flex flex-row gap-x-2" key={field.key}>
                  {field.label}:
                  <ClickToCopy text={data.tokenBuy.address} key={field.key}>
                    {truncateAddress(data.tokenBuy.address)}
                  </ClickToCopy>
                </div>
              );
            case "addressesPriceFeeds":
              return (
                <div className="flex flex-row gap-x-2" key={field.key}>
                  {field.label}:
                  {value.map((address: string) => {
                    return (
                      <ClickToCopy text={address} key={field.key}>
                        {truncateAddress(address)}
                      </ClickToCopy>
                    );
                  })}
                </div>
              );

            case "revertPriceFeeds":
              return (
                <div className="flex flex-row gap-x-2" key={field.key}>
                  <span>{field.label}:</span>
                  <span>{value.toString()}</span>
                </div>
              );
            case "tokenSellAmount":
            case "minOut":
              // eslint-disable-next-line no-case-declarations
              const unit =
                field.key == "tokenSellAmount"
                  ? data.tokenSell.symbol
                  : data.tokenBuy.symbol;
              return (
                <div className="flex flex-row gap-x-2" key={field.key}>
                  <span>{field.label}:</span>
                  <span>
                    {value} {unit}
                  </span>
                </div>
              );

            default:
              return (
                <div className="flex flex-row gap-x-2" key={field.key}>
                  <span>{field.label}:</span>
                  <span>{value}</span>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}
