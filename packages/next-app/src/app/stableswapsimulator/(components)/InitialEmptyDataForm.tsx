"use client";

import { StableSwapSimulatorDataSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
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
      <Form {...form} onSubmit={onSubmit} id="initial-data-form">
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
      </Form>
    </div>
  );
}
