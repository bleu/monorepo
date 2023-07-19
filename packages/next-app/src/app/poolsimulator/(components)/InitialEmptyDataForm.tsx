"use client";

import { StableSwapSimulatorDataSchema } from "#/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
import { AnalysisData, useStableSwap } from "#/contexts/PoolSimulatorContext";
import { numberToPercent, percentToNumber } from "#/utils/formatNumber";
import { GetDeepProp } from "#/utils/getTypes";

import { TokenTable } from "./TokenTable";

type StableSwapSimulatorDataSchemaType =
  typeof StableSwapSimulatorDataSchema._type;

interface InitialForm {
  tokens: GetDeepProp<StableSwapSimulatorDataSchemaType, "tokens"> | null;
  swapFee: GetDeepProp<StableSwapSimulatorDataSchemaType, "swapFee"> | null;
  ampFactor: GetDeepProp<StableSwapSimulatorDataSchemaType, "ampFactor"> | null;
}

export default function InitialEmptyDataForm() {
  const { push } = useRouter();
  const {
    initialData,
    setInitialData,
    setCustomData,
    setIsGraphLoading,
    setAnalysisTokenByIndex,
    setCurrentTabTokenByIndex,
  } = useStableSwap();
  const form = useForm<InitialForm>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onSubmit",
  });

  const {
    register,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (data: FieldValues) => {
    setIsGraphLoading(true);
    const dataToCalculate = {
      ...data,
      swapFee: percentToNumber(data.swapFee),
    };
    setInitialData(dataToCalculate as AnalysisData);
    setCustomData(dataToCalculate as AnalysisData);
    setAnalysisTokenByIndex(0);
    setCurrentTabTokenByIndex(1);
    push("/poolsimulator/analysis");
  };

  const swapFeeInPercentage = numberToPercent(initialData?.swapFee);

  useEffect(() => {
    clearErrors();
    if (initialData == getValues()) return;
    if (initialData?.tokens?.length == 0) {
      reset({ tokens: [], swapFee: null, ampFactor: null });
      return;
    }
    if (swapFeeInPercentage) setValue("swapFee", swapFeeInPercentage);
    if (initialData?.ampFactor) setValue("ampFactor", initialData?.ampFactor);
    if (initialData?.tokens) setValue("tokens", initialData?.tokens);
  }, [initialData]);

  useEffect(() => {
    register("tokens", { required: true, value: initialData?.tokens });
  }, []);

  return (
    <Form {...form} onSubmit={onSubmit} id="initial-data-form">
      <div className="flex flex-col gap-4">
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
                value: initialData?.ampFactor,
              }}
              defaultValue={initialData?.ampFactor}
              placeholder="Define the initial amp factor"
            />
          )}
        />

        <div className="flex flex-col">
          <label className="mb-2 block text-sm text-slate12">Tokens</label>
          {errors?.tokens?.message && (
            <div className="mt-1 h-6 text-sm text-tomato10">
              <span>{errors?.tokens?.message}</span>
            </div>
          )}
          <TokenTable />
        </div>

        <Button
          form="initial-data-form"
          type="submit"
          shade="light"
          className="h-min w-32 self-end"
        >
          Next step
        </Button>
      </div>
    </Form>
  );
}
