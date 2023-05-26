"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import useDebounce from "#/hooks/useDebounce";

import { TokenTable } from "./TokenTable";

export default function NewDataForm() {
  const {
    baselineData,
    variantData,
    setVariantData,
    setIndexAnalysisToken,
    indexAnalysisToken,
  } = useStableSwap();

  const {
    register,
    getValues,
    watch,
    formState: { errors },
  } = useForm<typeof StableSwapSimulatorDataSchema._type>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onChange",
  });

  const swapFee = watch("swapFee");
  const ampFactor = watch("ampFactor");
  const debouncedSwapFee = useDebounce(swapFee);
  const debouncedAmpFactor = useDebounce(ampFactor);

  const onSubmit = () => {
    if (Object.keys(errors).length) return;
    const data = getValues();
    setVariantData(data as AnalysisData);
  };

  useEffect(() => {
    register("tokens", { required: true, value: variantData?.tokens });
  }, []);

  useEffect(onSubmit, [debouncedSwapFee, debouncedAmpFactor]);

  return (
    <div className="flex flex-col gap-4">
      <form id="variant-data-form" />
      <div className="flex flex-col">
        <label className="mb-2 block text-sm text-slate12">
          Analysis Token
        </label>
        <Select
          onValueChange={(i) => setIndexAnalysisToken(Number(i))}
          defaultValue={indexAnalysisToken.toString()}
        >
          {baselineData?.tokens.map(({ symbol }, index) => (
            <SelectItem key={symbol} value={index.toString()}>
              {symbol}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Input
        {...register("swapFee", {
          required: true,
          value: variantData?.swapFee,
          valueAsNumber: true,
        })}
        label="Swap fee"
        extraLabel={`baseline: ${baselineData?.swapFee}`}
        placeholder="Define the variant swap fee"
        errorMessage={errors?.swapFee?.message}
        form="variant-data-form"
      />
      <Input
        {...register("ampFactor", {
          required: true,
          value: variantData?.ampFactor,
          valueAsNumber: true,
        })}
        label="Amp Factor"
        extraLabel={`baseline: ${baselineData?.ampFactor}`}
        placeholder="Define the variant amp factor"
        errorMessage={errors?.ampFactor?.message}
        form="variant-data-form"
      />
      <div className="flex flex-col">
        <label className="mb-2 block text-sm text-slate12">Tokens</label>
        <TokenTable minTokens={2} variant={true} />
      </div>
    </div>
  );
}
