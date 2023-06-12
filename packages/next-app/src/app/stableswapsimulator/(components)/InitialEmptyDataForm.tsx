"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
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
  const { initialData, setInitialData, setCustomData, setIsGraphLoading } =
    useStableSwap();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<InitialForm>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FieldValues) => {
    setIsGraphLoading(true);
    setInitialData(data as AnalysisData);
    setCustomData(data as AnalysisData);
    push("/stableswapsimulator/analysis");
  };

  useEffect(() => {
    clearErrors();
    if (initialData == getValues()) return;
    if (initialData?.tokens?.length == 0) {
      reset({ tokens: [], swapFee: null, ampFactor: null });
      return;
    }
    if (initialData?.swapFee) setValue("swapFee", initialData?.swapFee);
    if (initialData?.ampFactor) setValue("ampFactor", initialData?.ampFactor);
    if (initialData?.tokens) setValue("tokens", initialData?.tokens);
  }, [initialData]);

  useEffect(() => {
    register("tokens", { required: true, value: initialData?.tokens });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} id="initial-data-form" />
      <Input
        {...register("swapFee", {
          required: true,
          value: initialData?.swapFee,
          valueAsNumber: true,
        })}
        label="Swap fee"
        placeholder="Define the initial swap fee"
        errorMessage={errors?.swapFee?.message}
        form="initial-data-form"
      />
      <Input
        {...register("ampFactor", {
          required: true,
          value: initialData?.ampFactor,
          valueAsNumber: true,
        })}
        label="Amp factor"
        placeholder="Define the initial amp factor"
        errorMessage={errors?.ampFactor?.message}
        form="initial-data-form"
      />
      <div className="flex flex-col">
        <label className="mb-2 block text-sm text-slate12">Tokens</label>
        {errors?.tokens?.message && (
          <div className="h-6 mt-1 text-tomato10 text-sm">
            <span>{errors?.tokens?.message}</span>
          </div>
        )}
        <TokenTable />
      </div>
      <Button
        form="initial-data-form"
        type="submit"
        shade="light"
        className="w-32 h-min self-end"
      >
        Next step
      </Button>
    </div>
  );
}
