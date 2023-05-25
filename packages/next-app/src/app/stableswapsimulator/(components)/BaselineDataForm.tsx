"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import useDebounce from "#/hooks/useDebounce";

import { TokenTable } from "./TokenTable";

export default function BaselineDataForm() {
  const { baselineData, setBaselineData } = useStableSwap();
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<typeof StableSwapSimulatorDataSchema._type>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onChange",
  });

  const swapFee = watch("swapFee");
  const ampFactor = watch("ampFactor");
  const tokens = watch("tokens");
  const debouncedSwapFee = useDebounce(swapFee);
  const debouncedAmpFactor = useDebounce(ampFactor);

  const onSubmit = () => {
    if (Object.keys(errors).length) return;
    const data = getValues();
    setBaselineData(data as AnalysisData);
  };

  useEffect(() => {
    // TODO: BAL 401
    if (baselineData == getValues()) return;
    if (baselineData?.swapFee) setValue("swapFee", baselineData?.swapFee);
    if (baselineData?.ampFactor) setValue("ampFactor", baselineData?.ampFactor);
    if (baselineData?.tokens) setValue("tokens", baselineData?.tokens);
  }, [baselineData]);

  useEffect(onSubmit, [debouncedSwapFee, debouncedAmpFactor, tokens]);

  useEffect(() => {
    register("tokens", { required: true, value: baselineData?.tokens });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <form id="baseline-data-form" />
      <Input
        {...register("swapFee", {
          required: true,
          value: baselineData?.swapFee,
          valueAsNumber: true,
        })}
        label="Swap fee"
        placeholder="Define the initial swap fee"
        errorMessage={errors?.swapFee?.message}
        form="baseline-data-form"
      />
      <Input
        {...register("ampFactor", {
          required: true,
          value: baselineData?.ampFactor,
          valueAsNumber: true,
        })}
        label="Amp factor"
        placeholder="Define the initial amp factor"
        errorMessage={errors?.ampFactor?.message}
        form="baseline-data-form"
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
    </div>
  );
}
