"use client";

import { Address, Network, NetworkChainId, networkFor } from "@bleu-fi/utils";
import { formatDateToLocalDatetime } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { ArrowLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import {
  Controller,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useAccount, useNetwork } from "wagmi";

import {
  TokenSelect,
  TokenWalletBalance,
} from "#/app/milkman/(components)/TokenSelect";
import {
  stages,
  TransactionProgressBar,
} from "#/app/milkman/(components)/TransactionProgressBar";
import { TransactionStatus } from "#/app/milkman/utils/type";
import { Button } from "#/components";
import { Checkbox } from "#/components/Checkbox";
import { Input } from "#/components/Input";
import { LinkComponent } from "#/components/Link";
import { Select, SelectItem } from "#/components/Select";
import { Spinner } from "#/components/Spinner";
import { Form } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";
import { useOrder } from "#/contexts/OrderContext";
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { truncateAddress } from "#/utils/truncate";

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const { address } = useAccount();

  const addressLower = address ? address?.toLowerCase() : "";

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  const network = getNetwork(chain?.name);

  if (network !== params.network) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          You are on the wrong network
        </div>
        <div className="text-xl text-white">
          Please change to {params.network}
        </div>
      </div>
    );
  }

  return (
    <>
      <TransactionCard
        userAddress={addressLower as Address}
        chainId={chain?.id}
      />
    </>
  );
}

function TransactionCard({
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

  const form = useForm();
  const { register, setValue, watch, clearErrors } = form;

  useEffect(() => {
    register("receiverAddress");
    register("tokenBuy");
    register("tokenSell");
  }, []);

  const formData = watch();

  useEffect(() => {
    if (formData.isValidFromNeeded === false) {
      setValue("validFrom", null);
      clearErrors("validFrom");
    }
  }, [formData]);

  function handleOnSubmit(data: FieldValues) {
    //TODO trigger order BLEU-374
    // eslint-disable-next-line no-console
    console.log(data);
  }

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
      <FormSelectTokens form={form} userAddress={userAddress} />
    ),
    [TransactionStatus.ORDER_STRATEGY]: <FormSelectPriceChecker form={form} />,
    [TransactionStatus.ORDER_RESUME]: (
      <div className="flex flex-col gap-y-6 p-9">
        <OrderResume data={formData} handleBack={handleBack} />
      </div>
    ),
  };

  return (
    <div className="flex h-full items-center justify-center w-full mt-20">
      <Form
        {...form}
        onSubmit={handleOnSubmit}
        className="my-4 flex h-fit w-fit flex-col  rounded-lg border border-slate7 bg-blue3 text-white"
      >
        <div className="divide-y divide-slate7">
          <FormHeader
            transactionStatus={transactionStatus}
            network={network}
            onClick={handleBack}
          />
          {FORM_CONTENTS[transactionStatus]}
        </div>
        <FormFooter
          transactionStatus={transactionStatus}
          onClick={handleContinue}
        />
      </Form>
    </div>
  );
}

function FormHeader({
  transactionStatus,
  network,
  onClick,
}: {
  transactionStatus: TransactionStatus;
  network: Network;
  onClick: () => void;
}) {
  const isDraftSelectTokens =
    transactionStatus === TransactionStatus.ORDER_OVERVIEW;
  const isDraftResume = transactionStatus === TransactionStatus.ORDER_RESUME;

  function ArrowIcon() {
    return (
      <ArrowLeftIcon
        height={16}
        width={16}
        className="text-slate10 duration-200 hover:text-amber10"
      />
    );
  }
  return (
    <div className="relative flex h-full w-full justify-center">
      {isDraftSelectTokens ? (
        <LinkComponent
          loaderColor="amber"
          href={`/milkman/${network}`}
          content={
            <div className="absolute left-8 flex h-full items-center">
              <ArrowIcon />
            </div>
          }
        />
      ) : (
        <Button
          type="button"
          className="absolute left-8 flex h-full items-center bg-transparent border-0 hover:bg-transparent p-0"
          onClick={onClick}
        >
          <ArrowIcon />
        </Button>
      )}
      <div className="flex min-w-[530px] flex-col items-center py-3">
        <div className="text-xl">
          {!isDraftResume ? "Create order" : "Create transaction"}
        </div>
      </div>
    </div>
  );
}

function FormSelectTokens({
  form,
  userAddress,
}: {
  form: UseFormReturn;
  userAddress: string;
}) {
  const { register, setValue, control, watch } = form;
  const formData = watch();
  const isValidFromNeeded = formData.isValidFromNeeded;
  const { assets } = useSafeBalances();

  const tokenSell = assets.find(
    (asset) => asset.tokenInfo.address === formData.tokenSell?.address,
  );

  const walletAmount = !tokenSell
    ? 0
    : Number(tokenSell?.balance) / 10 ** tokenSell?.tokenInfo.decimals;

  function handleSelectTokenBuy(token: TokenWalletBalance) {
    setValue("tokenBuy", token);
  }

  function handleSelectTokenSell(token: TokenWalletBalance) {
    setValue("tokenSell", token);
  }

  return (
    <div className="flex flex-col gap-y-6 p-9">
      <div>
        <div className="flex h-fit justify-between gap-x-7">
          <div className="w-1/2">
            <TokenSelect
              onSelectToken={handleSelectTokenSell}
              tokenType="sell"
              selectedToken={formData.tokenSell ?? undefined}
            />
          </div>
          <div className="flex w-1/2 items-end gap-2">
            <div className="w-full">
              <Input
                type="number"
                label="Amount to sell"
                placeholder="0.0"
                {...register("tokenSellAmount")}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-x-1 text-xs">
          <span className="text-slate10">
            <span>
              Wallet Balance:{" "}
              {formatNumber(walletAmount, 4, "decimal", "standard", 0.0001)}
            </span>
          </span>
          <button
            type="button"
            className="text-blue9 outline-none hover:text-amber9"
            onClick={() => {
              setValue("tokenSellAmount", walletAmount);
            }}
          >
            Max
          </button>
        </div>
      </div>
      <div className="w-full">
        <TokenSelect
          onSelectToken={handleSelectTokenBuy}
          tokenType="buy"
          selectedToken={formData.tokenBuy ?? undefined}
        />
      </div>
      <div>
        <Input
          type="string"
          label="Recipient"
          placeholder={userAddress}
          {...register("receiverAddress")}
        />
        <div className="mt-2 flex gap-x-1 text-xs">
          <button
            type="button"
            className="text-blue9 outline-none hover:text-amber9"
            onClick={() => {
              setValue("receiverAddress", userAddress);
            }}
          >
            Use Current Address
          </button>
        </div>
      </div>
      <Controller
        control={control}
        name="isValidFromNeeded"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            id="isValidFromNeeded"
            checked={value}
            onChange={() => onChange(!value)}
            label="Order will need valid from"
          />
        )}
      />
      {isValidFromNeeded && (
        <div>
          <Input
            type="datetime-local"
            label="Valid from"
            {...register("validFrom")}
          />
          <div className="mt-2 flex gap-x-1 text-xs">
            <button
              type="button"
              className="text-blue9 outline-none hover:text-amber9"
              onClick={() => {
                setValue("validFrom", formatDateToLocalDatetime(new Date()));
              }}
            >
              Use Current Date time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSelectPriceChecker({ form }: { form: UseFormReturn }) {
  const { register, control } = form;
  return (
    <div className="flex flex-col gap-y-6 p-9">
      <div className="mb-2">
        <Label>Price checker</Label>
        <Controller
          control={control}
          name="priceChecker"
          render={({ field: { onChange, value } }) => (
            <Select
              onValueChange={onChange}
              value={value}
              className="w-full mt-2"
            >
              <SelectItem value="0xEB2bD2818F7CF1D92D81810b0d45852bE48E1502">
                FixedMinOutPriceChecker
              </SelectItem>
            </Select>
          )}
        />
      </div>
      {/* //TODO get all args when the priceChecker is selected  BLEU-374*/}
      <Input
        type="string"
        label="Token to buy minimum amount"
        {...register("tokenBuyMinimumAmount")}
      />
    </div>
  );
}

function OrderResume({
  data,
  handleBack,
}: {
  data: FieldValues;
  handleBack: () => void;
}) {
  const fieldsToDisplay = [
    { label: "Token to sell", key: "tokenSell" },
    { label: "Token to buy", key: "tokenBuy" },
    { label: "Amount to sell", key: "tokenSellAmount" },
    { label: "Price checker", key: "priceChecker" },
    { label: "Token to buy minimum amount", key: "tokenBuyMinimumAmount" },
    { label: "Valid from", key: "validFrom" },
  ];

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
          if (field.key === "tokenSell") {
            return (
              value && (
                <span key={field.key}>
                  {field.label}: {value.symbol} (
                  {truncateAddress(data.tokenSell.address)})
                </span>
              )
            );
          }
          if (field.key === "tokenBuy") {
            return (
              value && (
                <span key={field.key}>
                  {field.label}: {value.symbol} (
                  {truncateAddress(data.tokenBuy.address)})
                </span>
              )
            );
          }
          return (
            value && (
              <span key={field.key}>
                {field.label}: {value}
              </span>
            )
          );
        })}
      </div>
    </div>
  );
}

function FormFooter({
  transactionStatus,
  onClick,
}: {
  transactionStatus: TransactionStatus;
  onClick: () => void;
}) {
  const isDraftResume = transactionStatus === TransactionStatus.ORDER_RESUME;
  return (
    <div className="flex flex-col px-10 gap-y-5 mb-5">
      {!isDraftResume && (
        <TransactionProgressBar
          currentStageName={transactionStatus}
          totalSteps={2}
        />
      )}
      <div className="flex justify-center gap-x-5">
        {isDraftResume ? (
          <>
            <Button type="button" className="w-full" color="slate" disabled>
              <span>Add one more order</span>
            </Button>
            <Button type="submit" className="w-full">
              <span>Build transaction</span>
            </Button>
          </>
        ) : (
          <Button type="button" className="w-full" onClick={onClick}>
            <span>Continue</span>
          </Button>
        )}
      </div>
    </div>
  );
}
