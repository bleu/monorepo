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
  const { initialData, setInitialData, newPoolImportedFlag } = useStableSwap();
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
        value: initialData?.[field],
        valueAsNumber: true,
      }),
      label: capitalize(label),
      placeholder: `Define the initial ${label}`,
      errorMessage: errors[field]?.message?.toString() || "",
      form: "initial-data-form",
    };
  };

  const onSubmit = (data: FieldValues) => {
    // TODO: BAL 382
    setInitialData(data as AnalysisData);
    push("/stableswapsimulator/analysis");
    return;
  };

  useEffect(clearErrors, [newPoolImportedFlag]);

  useEffect(() => {
    // TODO: BAL 401
    if (initialData?.swapFee) setValue("swapFee", initialData?.swapFee);
    if (initialData?.ampFactor) setValue("ampFactor", initialData?.ampFactor);
    initialData?.tokens.forEach((token, i) => {
      setValue(`tokens.${i}.symbol`, token.symbol);
      setValue(`tokens.${i}.balance`, token.balance);
      setValue(`tokens.${i}.rate`, token.rate);
    });
  }, [initialData]);

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
          {initialData?.tokens.map((token, i) => (
            <div key={token.symbol}>
              <input
                form="initial-data-form"
                {...register(`tokens.${i}.symbol`)}
              />
              <input
                form="initial-data-form"
                {...register(`tokens.${i}.balance`)}
              />
              <input
                form="initial-data-form"
                {...register(`tokens.${i}.rate`)}
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
