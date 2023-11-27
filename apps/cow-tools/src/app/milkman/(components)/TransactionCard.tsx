import { Address, NetworkChainId, networkFor } from "@bleu-fi/utils";
import { useState } from "react";
import { FieldValues } from "react-hook-form";

import { stages } from "#/app/milkman/(components)/SingleOrderForm/TransactionProgressBar";
import { TransactionStatus } from "#/app/milkman/utils/type";
import { useOrder } from "#/contexts/OrderContext";

import { FormHeader } from "./SingleOrderForm/Header";
import { FormOrderOverview } from "./SingleOrderForm/Overview";
import { FormSelectPriceChecker } from "./SingleOrderForm/PriceChecker";
import { OrderSummary } from "./SingleOrderForm/Summary";
import { FormTwap } from "./SingleOrderForm/Twap";

export function TransactionCard({
  userAddress,
  chainId,
}: {
  userAddress: Address;
  chainId?: NetworkChainId;
  walletAmount?: string;
  walletAmountBigNumber?: bigint;
}) {
  const { transactionStatus, setTransactionStatus } = useOrder();
  const network = networkFor(chainId);

  const [orderOverviewData, setOrderOverviewData] = useState<FieldValues>();
  const [priceCheckerData, setPriceCheckerData] = useState<FieldValues>();
  const [twapData, setTwapData] = useState<FieldValues>();

  function handleBack() {
    const currentStage = stages.find(
      (stage) => stage.name === transactionStatus,
    );
    setTransactionStatus(currentStage?.previousStage ?? transactionStatus);
  }

  function handleContinue() {
    const currentStage = stages.find(
      (stage) => stage.name === transactionStatus,
    );
    setTransactionStatus(currentStage?.nextStage ?? transactionStatus);
  }

  const FORM_CONTENTS: { [key in TransactionStatus]?: JSX.Element } = {
    [TransactionStatus.ORDER_OVERVIEW]: (
      <FormOrderOverview
        onSubmit={(data: FieldValues) => {
          setOrderOverviewData(data);
          handleContinue();
        }}
        userAddress={userAddress}
        defaultValues={orderOverviewData}
      />
    ),
    [TransactionStatus.ORDER_STRATEGY]: (
      <FormSelectPriceChecker
        onSubmit={(data: FieldValues) => {
          setPriceCheckerData(data);
          handleContinue();
        }}
        defaultValues={priceCheckerData}
        tokenSellAddress={orderOverviewData?.tokenSell.address}
        tokenBuyAddress={orderOverviewData?.tokenBuy.address}
        tokenBuyDecimals={orderOverviewData?.tokenBuy.decimals}
      />
    ),
    [TransactionStatus.ORDER_TWAP]: (
      <FormTwap
        onSubmit={(data: FieldValues) => {
          setTwapData(data);
          handleContinue();
        }}
        defaultValues={twapData}
      />
    ),
    [TransactionStatus.ORDER_SUMMARY]: (
      <div className="flex flex-col gap-y-6 p-9">
        <OrderSummary
          data={{ ...orderOverviewData, ...priceCheckerData, ...twapData }}
          handleBack={handleBack}
          network={network}
        />
      </div>
    ),
  };

  return (
    <div className="flex h-full items-center justify-center w-full mt-20">
      <div className="my-4 flex h-fit w-fit flex-col  rounded-lg border border-slate7 bg-blue3 text-white">
        <div className="divide-y divide-slate7">
          <FormHeader
            transactionStatus={transactionStatus}
            network={network}
            onClick={handleBack}
          />
          {FORM_CONTENTS[transactionStatus]}
        </div>
      </div>
    </div>
  );
}
