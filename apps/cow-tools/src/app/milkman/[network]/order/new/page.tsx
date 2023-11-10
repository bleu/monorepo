"use client";

import { Address, Network, NetworkChainId, networkFor } from "@bleu-fi/utils";
import { formatDateToLocalDatetime } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { formatUnits } from "viem";
import { goerli } from "viem/chains";
import { useAccount, useNetwork } from "wagmi";

import { TokenSelect } from "#/app/milkman/(components)/TokenSelect";
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
import { Form, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";
import { useOrder } from "#/contexts/OrderContext";
import { useRawTxData } from "#/hooks/useRawTxData";
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { PRICE_CHECKERS, priceCheckerInfoMapping } from "#/lib/priceCheckers";
import { orderOverviewSchema } from "#/lib/schema";
import { MILKMAN_ADDRESS, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { truncateAddress } from "#/utils/truncate";

export type tokenPriceChecker = {
  symbol: string;
  address: string;
  decimals: number;
};

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

  // const form1 = useForm();
  // const form2 = useForm();

  const [orderOverviewData, setOrderOverviewData] = useState<FieldValues>();
  const [priceCheckerData, setPriceCheckerData] = useState<FieldValues>();

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
      />
    ),
    [TransactionStatus.ORDER_RESUME]: (
      <div className="flex flex-col gap-y-6 p-9">
        <OrderResume
          data={{ ...orderOverviewData, ...priceCheckerData }}
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

function FormOrderOverview({
  onSubmit,
  userAddress,
  defaultValues,
}: {
  onSubmit: (data: FieldValues) => void;
  userAddress: string;
  defaultValues?: FieldValues;
}) {
  const form = useForm<typeof orderOverviewSchema._type>({
    resolver: zodResolver(orderOverviewSchema),
  });
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    register("tokenBuy");
    register("tokenSell");
    register("validFrom");
  }, []);

  const { assets, loaded } = useSafeBalances();

  const formData = watch();

  const tokenSell = assets.find(
    (asset) => asset.tokenInfo.address === formData.tokenSell?.address,
  );

  const walletAmount = !tokenSell
    ? 0
    : formatUnits(BigInt(tokenSell?.balance), tokenSell?.tokenInfo.decimals);

  const [isValidFromNeeded, setIsValidFromNeeded] = useState(
    !!defaultValues?.validFrom,
  );

  useEffect(() => {
    if (
      loaded &&
      defaultValues?.tokenBuy?.address &&
      defaultValues?.tokenSell?.address
    ) {
      setValue("tokenBuy", defaultValues?.tokenBuy);
      setValue("tokenSell", defaultValues?.tokenSell);
    }
  }, [loaded]);

  useEffect(() => {
    if (isValidFromNeeded === false) {
      setValue("validFrom", undefined);
      clearErrors("validFrom");
    }
  }, [isValidFromNeeded]);

  function handleSelectTokenBuy(token: tokenPriceChecker) {
    setValue("tokenBuy", {
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
    });
  }

  function handleSelectTokenSell(token: tokenPriceChecker) {
    setValue("tokenSell", {
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
    });
  }

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <div>
        <div className="flex h-fit justify-between gap-x-7">
          <div className="w-1/2 flex flex-col">
            <TokenSelect
              onSelectToken={handleSelectTokenSell}
              tokenType="sell"
              selectedToken={formData.tokenSell ?? undefined}
            />
            <div className="mt-1 flex flex-col">
              {errors.tokenSell && (
                <FormMessage className="h-6 text-sm text-tomato10">
                  <span>{errors.tokenSell.message}</span>
                </FormMessage>
              )}
              <div className="flex gap-x-1 text-xs">
                <span className="text-slate10">
                  <span>
                    Wallet Balance:{" "}
                    {formatNumber(
                      walletAmount,
                      4,
                      "decimal",
                      "standard",
                      0.0001,
                    )}
                  </span>
                </span>
                <button
                  type="button"
                  className="text-blue9 outline-none hover:text-amber9"
                  onClick={() => {
                    setValue("tokenSellAmount", Number(walletAmount));
                  }}
                >
                  Max
                </button>
              </div>
            </div>
          </div>
          <div className="flex w-1/2 items-start gap-2">
            <div className="w-full">
              <Input
                type="number"
                label="Amount to sell"
                placeholder="0.0"
                step={10 ** formData.tokenSell?.decimals}
                defaultValue={defaultValues?.tokenSellAmount}
                {...register("tokenSellAmount")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <TokenSelect
          onSelectToken={handleSelectTokenBuy}
          tokenType="buy"
          selectedToken={formData.tokenBuy ?? undefined}
        />
        {errors.tokenBuy && (
          <FormMessage className="mt-1 h-6 text-sm text-tomato10">
            <span>{errors.tokenBuy.message}</span>
          </FormMessage>
        )}
      </div>
      <div>
        <Input
          type="string"
          label="Recipient"
          placeholder={userAddress}
          defaultValue={defaultValues?.receiverAddress}
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

      <Checkbox
        id="isValidFromNeeded"
        checked={isValidFromNeeded}
        onChange={() => setIsValidFromNeeded(!isValidFromNeeded)}
        label="Order will need valid from"
      />
      {isValidFromNeeded && (
        <div>
          <Input
            type="datetime-local"
            label="Valid from"
            defaultValue={defaultValues?.validFrom}
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
      <FormFooter transactionStatus={TransactionStatus.ORDER_OVERVIEW} />
    </Form>
  );
}

function FormSelectPriceChecker({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: FieldValues) => void;
  defaultValues?: FieldValues;
}) {
  const [selectedPriceChecker, setSelectedPriceChecker] =
    useState<PRICE_CHECKERS>(defaultValues?.priceChecker);

  const form = useForm(
    selectedPriceChecker && {
      resolver: zodResolver(
        priceCheckerInfoMapping[selectedPriceChecker].schema,
      ),
      mode: "onSubmit",
    },
  );

  const { register, clearErrors, setValue } = form;

  useEffect(() => {
    clearErrors();
    register("priceChecker");
    register("priceCheckerAddress");
    if (!selectedPriceChecker) {
      return;
    }
    setValue("priceChecker", selectedPriceChecker);
    setValue(
      "priceCheckerAddress",
      priceCheckerInfoMapping[selectedPriceChecker].addresses[goerli.id],
    );
  }, [selectedPriceChecker]);

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <div className="mb-2">
        <Label>Price checker</Label>
        <Select
          onValueChange={(priceChecker) => {
            setSelectedPriceChecker(priceChecker as PRICE_CHECKERS);
          }}
          className="w-full mt-2"
          defaultValue={defaultValues?.priceChecker}
        >
          {Object.values(PRICE_CHECKERS).map((priceChecker) => (
            <SelectItem value={priceChecker} key={priceChecker}>
              {priceChecker}
            </SelectItem>
          ))}
        </Select>
      </div>
      {selectedPriceChecker &&
        priceCheckerInfoMapping[
          selectedPriceChecker as PRICE_CHECKERS
        ].arguments.map((arg) => (
          <Input
            type={arg.inputType}
            label={arg.label}
            key={arg.name}
            defaultValue={defaultValues?.[arg.name]}
            {...register(arg.name)}
          />
        ))}
      <FormFooter
        transactionStatus={TransactionStatus.ORDER_STRATEGY}
        disabled={!selectedPriceChecker}
      />
    </Form>
  );
}

function OrderResume({
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
    ...priceCheckerInfoMapping[
      data.priceChecker as PRICE_CHECKERS
    ].arguments.map((arg) => ({
      label: arg.label,
      key: arg.name,
    })),
  ];

  const router = useRouter();

  const { sendTransactions } = useRawTxData();

  async function handleButtonClick() {
    const sellAmountBigInt = BigInt(
      Number(data.tokenSellAmount) * 10 ** data.tokenSell.decimals,
    );
    const priceCheckersArgs = priceCheckerInfoMapping[
      data.priceChecker as PRICE_CHECKERS
    ].arguments.map((arg) =>
      arg.convertInput(data[arg.name], data.tokenBuy.decimals),
    );

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
      <div className="mt-5">
        <FormFooter
          transactionStatus={TransactionStatus.ORDER_RESUME}
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
}

function FormFooter({
  transactionStatus,
  onClick,
  disabled = false,
}: {
  transactionStatus: TransactionStatus;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const isDraftResume = transactionStatus === TransactionStatus.ORDER_RESUME;
  return (
    <div className="flex flex-col gap-y-5">
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
            <Button type="submit" className="w-full" onClick={onClick}>
              <span>Build transaction</span>
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            className="w-full"
            onClick={onClick}
            disabled={disabled}
          >
            <span>Continue</span>
          </Button>
        )}
      </div>
    </div>
  );
}
