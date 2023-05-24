"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { capitalize } from "@balancer-pool-metadata/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import useDebounce from "#/hooks/useDebounce";

import { TokenTable } from "./TokenTable";

export default function BaselineDataForm() {
  const { baselineData, setBaselineData, newPoolImportedFlag } =
    useStableSwap();
  const {
    register,
    getValues,
    clearErrors,
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
      form: "baseline-data-form",
    };
  };

  const handleChange = () => {
    if (Object.keys(errors).length) return;
    const data = getValues();
    setBaselineData(data as AnalysisData);
  };

  useEffect(handleChange, [debouncedSwapFee, debouncedAmpFactor, tokens]);

  useEffect(clearErrors, [baselineData?.tokens, newPoolImportedFlag]);

  return (
    <div className="flex flex-col gap-4">
      <form id="baseline-data-form" />
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
    </div>
  );
}
