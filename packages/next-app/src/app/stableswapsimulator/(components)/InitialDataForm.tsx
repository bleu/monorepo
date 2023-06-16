"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import useDebounce from "#/hooks/useDebounce";

import { TokenTable } from "./TokenTable";

export default function InitialDataForm() {
  const { initialData, setInitialData } = useStableSwap();
  const form = useForm<typeof StableSwapSimulatorDataSchema._type>({
    resolver: zodResolver(StableSwapSimulatorDataSchema),
    mode: "onChange",
  });
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const swapFee = watch("swapFee");
  const ampFactor = watch("ampFactor");
  const tokens = watch("tokens");
  const debouncedSwapFee = useDebounce(swapFee);
  const debouncedAmpFactor = useDebounce(ampFactor);
  const debouncedTokens = useDebounce(tokens);

  const baselineAndFieldsAreEqual = () => {
    const ampIsEqual = initialData?.ampFactor == getValues().ampFactor;
    const swapFeeIsEqual = initialData?.swapFee == getValues().swapFee;
    const tokensAreEqual = initialData?.tokens == getValues().tokens;
    return ampIsEqual && swapFeeIsEqual && tokensAreEqual;
  };

  const onSubmit = () => {
    if (baselineAndFieldsAreEqual()) return;
    if (Object.keys(errors).length) return;
    const data = getValues();
    setInitialData(data as AnalysisData);
  };

  useEffect(() => {
    // TODO: BAL 401
    if (baselineAndFieldsAreEqual()) return;
    if (initialData?.swapFee) setValue("swapFee", initialData?.swapFee);
    if (initialData?.ampFactor) setValue("ampFactor", initialData?.ampFactor);
    if (initialData?.tokens) setValue("tokens", initialData?.tokens);
  }, [initialData]);

  useEffect(onSubmit, [debouncedSwapFee, debouncedAmpFactor, debouncedTokens]);

  useEffect(() => {
    register("tokens", { required: true, value: initialData?.tokens });
  }, []);

  return (
    <Form id="baseline-data-form" onSubmit={onSubmit} {...form}>
      <div className="flex flex-col gap-4">
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
                value: initialData?.swapFee,
              }}
              defaultValue={initialData?.swapFee}
              placeholder="Define the initial swap fee"
            />
          )}
        />

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
          <TokenTable minTokens={2} />
        </div>
      </div>
    </Form>
  );
}
