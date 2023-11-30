import { formatDateToLocalDatetime } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
    defaultValues,
  });
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    register("tokenBuy");
    register("tokenSell");
  }, []);

  const { assets, loaded } = useSafeBalances();

  const formData = watch();
  const tokenSell = assets.find(
    (asset) => asset.tokenInfo.address === formData.tokenSell?.address,
  );

  const walletAmount = !tokenSell
    ? 0
    : formatUnits(BigInt(tokenSell?.balance), tokenSell?.tokenInfo.decimals);

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
            <div className="w-full flex flex-col">
              <Input
                type="number"
                label="Amount to sell"
                placeholder="0.0"
                step={10 ** -defaultValues?.tokenSellAmount.decimals || 10e-18}
                {...register("tokenSellAmount")}
              />
              {formData.tokenSellAmount > Number(walletAmount) && (
                <div className="mt-1">
                  <FormMessage className="h-6 text-sm text-amber9">
                    <span>Insufficient funds of this token.</span>
                  </FormMessage>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <TokenSelect
          onSelectToken={getHandleSelectToken("tokenBuy")}
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
        checked={formData.isValidFromNeeded}
        label="Order will need valid from"
        onChange={() =>
          setValue("isValidFromNeeded", !formData.isValidFromNeeded)
        }
      />
      <div>
        <Input
          type="datetime-local"
          label="Valid from"
          disabled={!formData.isValidFromNeeded}
          {...register("validFrom")}
        />
        <div className="mt-2 flex gap-x-1 text-xs">
          <button
            type="button"
            disabled={!formData.isValidFromNeeded}
            className="text-blue9 outline-none hover:text-amber9"
            onClick={() => {
              setValue("validFrom", formatDateToLocalDatetime(new Date()));
            }}
          >
            Use Current Date time
          </button>
        </div>
      </div>
      <FormFooter transactionStatus={TransactionStatus.ORDER_OVERVIEW} />
    </Form>
  );
}
