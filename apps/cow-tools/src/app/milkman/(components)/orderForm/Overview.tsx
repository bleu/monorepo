import { formatDateToLocalDatetime } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { formatUnits } from "viem";

import { TokenSelect } from "#/app/milkman/(components)/TokenSelect";
import { TransactionStatus } from "#/app/milkman/utils/type";
import { Checkbox } from "#/components/Checkbox";
import { Input } from "#/components/Input";
import { Form, FormMessage } from "#/components/ui/form";
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { orderOverviewSchema } from "#/lib/schema";

import { tokenPriceChecker } from "../../[network]/order/new/page";
import { FormFooter } from "./Footer";
import { Tooltip } from "#/components/Tooltip";

export function FormOrderOverview({
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
    mode: "onSubmit",
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

  function getHandleSelectToken(variable: "tokenBuy" | "tokenSell") {
    return (token: tokenPriceChecker) => {
      setValue(variable, {
        decimals: token.decimals,
        address: token.address,
        symbol: token.symbol,
      });
    };
  }

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <div>
        <div className="flex h-fit justify-between gap-x-7">
          <div className="w-1/2 flex flex-col">
            <TokenSelect
              onSelectToken={getHandleSelectToken("tokenSell")}
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
            <div className="w-full flex items-end">
              <Input
                type="number"
                label="Amount to sell"
                placeholder="0.0"
                defaultValue={defaultValues?.tokenSellAmount}
                {...register("tokenSellAmount")}
              />
              {formData.tokenSellAmount > Number(walletAmount) && (
                <div className="m-2">
                  <Tooltip content="You don't have enough funds of this token.">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber9 hover:text-amber9" />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex">
          <TokenSelect
            onSelectToken={getHandleSelectToken("tokenBuy")}
            tokenType="buy"
            selectedToken={formData.tokenBuy ?? undefined}
          />
        </div>
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
