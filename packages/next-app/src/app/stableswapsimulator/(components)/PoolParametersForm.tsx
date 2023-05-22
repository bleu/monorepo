"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { capitalize } from "@balancer-pool-metadata/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";

import { TokenTable } from "./TokenTable";

export default function PoolParametersForm() {
  const { initialData, newPoolImportedFlag } = useStableSwap();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<typeof StableSwapSimulatorDataSchema._type>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
  });

  const inputParameters = (field: keyof AnalysisData) => {
    const label = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    if (field == "tokens") return; // TODO: BAL 386
    return {
      ...register(field, {
        required: true,
        value: initialData?.[field],
        valueAsNumber: true,
      }),
      label: capitalize(label),
      placeholder: `Define the initial ${label}`,
      errorMessage: errors[field]?.message?.toString() || "",
    };
  };

  const onSubmit = () => {
    return;
    // TODO: BAL 382
  };

  useEffect(() => {
    // TODO: BAL 401
    clearErrors();
    setValue("swapFee", initialData?.swapFee);
    setValue("ampFactor", initialData?.ampFactor);
  }, [newPoolImportedFlag]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="initial-data-form">
      <div className="flex flex-col gap-4">
        <Input {...inputParameters("swapFee")} />
        <Input {...inputParameters("ampFactor")} />
        <TokenTable />
        <Button
          form="initial-data-form"
          type="submit"
          shade="light"
          className="w-32 h-min self-end"
        >
          Next step
        </Button>
      </div>
    </form>
  );
}
