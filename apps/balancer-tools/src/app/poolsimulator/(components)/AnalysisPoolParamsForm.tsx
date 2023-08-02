"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Select, SelectItem } from "#/components/Select";
import { Form, FormLabel } from "#/components/ui/form";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

export default function AnalysisPoolParamsForm() {
  const {
    initialData,
    customData,
    setAnalysisTokenByIndex,
    analysisToken,
    setCurrentTabTokenByIndex,
  } = usePoolSimulator();

  const form = useForm({
    mode: "onChange",
  });

  const {
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const onSubmit = () => {
    if (Object.keys(errors).length) return;
  };

  useEffect(() => {
    setAnalysisTokenByIndex(0);
    setCurrentTabTokenByIndex(1);
  }, []);

  const indexCurrentTabToken = initialData?.tokens.findIndex(
    ({ symbol }) => symbol.toLowerCase() !== analysisToken.symbol.toLowerCase()
  );

  useEffect(() => {
    // TODO: BAL 401
    if (customData?.tokens == getValues().tokens) return;
    if (customData?.tokens) setValue("tokens", customData?.tokens);
  }, [customData?.tokens]);

  return (
    <Form id="variant-data-form" {...form} onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <FormLabel className="mb-2 block text-sm text-slate12">
            Analysis Token
          </FormLabel>
          <Select
            onValueChange={(i) => {
              if (indexCurrentTabToken === Number(i)) {
                setCurrentTabTokenByIndex(
                  initialData?.tokens.findIndex(
                    (value, index) => index !== Number(i)
                  )
                );
              }
              setAnalysisTokenByIndex(Number(i));
            }}
            defaultValue={"0"}
          >
            {initialData?.tokens.map(({ symbol }, index) => (
              <SelectItem key={symbol} value={index.toString()}>
                {symbol}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </Form>
  );
}
