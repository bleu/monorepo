"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { capitalize } from "@balancer-pool-metadata/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";

import { TokenTable } from "./TokenTable";

export default function InitialDataForm() {
  const { push } = useRouter();
  const { baselineData, setBaselineData, setVariantData, newPoolImportedFlag } =
    useStableSwap();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<typeof StableSwapSimulatorDataSchema._type>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onSubmit",
  });

  const inputParameters = (field: keyof AnalysisData) => {
    const label = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    if (field == "tokens") return;
    return {
      ...register(field, {
        required: true,
        value: baselineData?.[field],
        valueAsNumber: true,
      }),
      label: capitalize(label),
      placeholder: `Define the initial ${label}`,
      errorMessage: errors[field]?.message?.toString() || "",
      form: "initial-data-form",
    };
  };

  const onSubmit = (data: FieldValues) => {
    setBaselineData(data as AnalysisData);
    setVariantData(data as AnalysisData);
    push("/stableswapsimulator/analysis");
  };

  useEffect(() => {
    // TODO: BAL 401
    if (baselineData?.swapFee) setValue("swapFee", baselineData?.swapFee);
    if (baselineData?.ampFactor) setValue("ampFactor", baselineData?.ampFactor);
    if (baselineData?.tokens) setValue("tokens", baselineData?.tokens);
  }, [baselineData]);

  useEffect(clearErrors, [baselineData?.tokens, newPoolImportedFlag]);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} id="initial-data-form" />
      <Input {...inputParameters("swapFee")} />
      <Input {...inputParameters("ampFactor")} />
      <div className="flex flex-col">
        <label className="mb-2 block text-sm text-slate12">Tokens</label>
        {errors?.tokens?.message && (
          <div className="h-6 mt-1 text-tomato10 text-sm">
            <span>{errors?.tokens?.message}</span>
          </div>
        )}
        <div hidden={true}>
          {baselineData?.tokens.map((token, i) => (
            <div key={token.symbol}>
              <input
                form="baseline-data-form"
                {...register(`tokens.${i}.symbol`, {
                  value: token.symbol,
                })}
              />
              <input
                form="baseline-data-form"
                {...register(`tokens.${i}.balance`, { value: token.balance })}
              />
              <input
                form="baseline-data-form"
                {...register(`tokens.${i}.rate`, {
                  value: token.rate,
                })}
              />
            </div>
          ))}
        </div>
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
