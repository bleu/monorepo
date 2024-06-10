import { brownDark } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import { ammEditSchema, ammFormSchema } from "#/lib/schema";
import { PRICE_ORACLES, PriceOraclesValue } from "#/lib/types";

import { BalancerWeightedForm } from "./BalancerWeightedForm";
import { ChainlinkForm } from "./ChainlinkForm";
import { CustomOracleForm } from "./CustomOracleForm";
import { SelectInput } from "./SelectInput";
import { SushiForm } from "./SushiForm";
import { Tooltip } from "./Tooltip";
import { FormMessage } from "./ui/form";
import { Label } from "./ui/label";
import { UniswapV2Form } from "./UniswapV2Form";

export function PriceOracleForm({
  form,
}: {
  form: UseFormReturn<
    z.input<typeof ammFormSchema> | z.input<typeof ammEditSchema>
  >;
}) {
  const {
    setValue,
    formState: { errors },
    control,
  } = form;

  const priceOracle = useWatch({
    control,
    name: "priceOracleSchema.priceOracle",
  });

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-x-7">
        <div className="w-full">
          <div className="flex gap-x-2 mb-2">
            <Label>Price Oracle Source</Label>
            <Tooltip
              content={
                "The AMM relies on price oracle exclusively for generating orders that will plausibly be settled in the current market conditions"
              }
            >
              <InfoCircledIcon className="size-4" color={brownDark.brown8} />
            </Tooltip>
          </div>
          <SelectInput
            name="priceOracle"
            options={Object.values(PRICE_ORACLES).map((value) => ({
              id: value,
              value,
            }))}
            onValueChange={(priceOracle) => {
              setValue(
                "priceOracleSchema.priceOracle",
                priceOracle as PriceOraclesValue,
              );
            }}
            placeholder={priceOracle}
          />
          {errors.priceOracleSchema?.priceOracle && (
            <FormMessage className="text-sm text-destructive w-full">
              <p className="text-wrap">
                {errors.priceOracleSchema?.priceOracle?.message as string}
              </p>
            </FormMessage>
          )}
        </div>
      </div>

      {priceOracle === PRICE_ORACLES.BALANCER && (
        <BalancerWeightedForm form={form} />
      )}
      {priceOracle === PRICE_ORACLES.UNI && <UniswapV2Form form={form} />}
      {priceOracle === PRICE_ORACLES.CUSTOM && <CustomOracleForm form={form} />}
      {priceOracle === PRICE_ORACLES.SUSHI && <SushiForm form={form} />}
      {priceOracle === PRICE_ORACLES.CHAINLINK && <ChainlinkForm form={form} />}
    </div>
  );
}
