"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Form, FormField, FormLabel } from "#/components/ui/form";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import useDebounce from "#/hooks/useDebounce";
import { StableSwapSimulatorDataSchema } from "#/lib/schema";
import { numberToPercent, percentToNumber } from "#/utils/formatNumber";

import { TokenTable } from "./TokenTable";

export default function CustomDataForm() {
  const {
    initialData,
    customData,
    setCustomData,
    setIndexAnalysisToken,
    indexAnalysisToken,
    indexCurrentTabToken,
    setIndexCurrentTabToken,
  } = useStableSwap();

  const form = useForm<typeof StableSwapSimulatorDataSchema._type>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onChange",
  });

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = form;

  const swapFee = watch("swapFee");
  const ampFactor = watch("ampFactor");
  const debouncedSwapFee = useDebounce(swapFee);
  const debouncedAmpFactor = useDebounce(ampFactor);

  const onSubmit = () => {
    if (Object.keys(errors).length) return;

    const data = getValues();
    const dataToCalculate = {
      ...data,
      swapFee: percentToNumber(data.swapFee),
    };
    setCustomData(dataToCalculate as AnalysisData);
  };

  useEffect(() => {
    register("tokens", { required: true, value: customData?.tokens });
  }, []);

  const swapFeeInPercentage = numberToPercent(customData?.swapFee);

  useEffect(() => {
    // TODO: BAL 401
    if (customData?.tokens == getValues().tokens) return;
    if (customData?.tokens) setValue("tokens", customData?.tokens);
  }, [customData?.tokens]);

  useEffect(onSubmit, [debouncedSwapFee, debouncedAmpFactor]);

  return (
    <Form id="variant-data-form" {...form} onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <FormLabel className="mb-2 block text-sm text-slate12">
            Analysis Token
          </FormLabel>
          <Select
            onValueChange={(i) => {
              if (indexCurrentTabToken === Number(i)) {
                setIndexCurrentTabToken(
                  initialData?.tokens.findIndex(
                    (value, index) => index !== Number(i),
                  ),
                );
              }
              setIndexAnalysisToken(Number(i));
            }}
            defaultValue={indexAnalysisToken.toString()}
          >
            {initialData?.tokens.map(({ symbol }, index) => (
              <SelectItem key={symbol} value={index.toString()}>
                {symbol}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="relative">
          <FormField
            name="swapFee"
            render={({ field }) => (
              <Input
                {...field}
                label="Swap fee"
                type="number"
                validation={{
                  required: true,
                  valueAsNumber: true,
                  value: swapFeeInPercentage,
                }}
                defaultValue={swapFeeInPercentage}
                placeholder="Define the initial swap fee"
              />
            )}
          />
          <span className="absolute top-8 right-2 flex items-center text-slate10">
            %
          </span>
        </div>

        <FormField
          name="ampFactor"
          render={({ field }) => (
            <Input
              {...field}
              label="Amp Factor"
              type="number"
              validation={{
                required: true,
                valueAsNumber: true,
                value: customData?.ampFactor,
              }}
              defaultValue={customData?.ampFactor}
              placeholder="Define the initial amp factor"
            />
          )}
        />
        <div className="flex flex-col">
          <label className="mb-2 block text-sm text-slate12">Tokens</label>
          <TokenTable minTokens={2} variant={true} />
        </div>
      </div>
    </Form>
  );
}
