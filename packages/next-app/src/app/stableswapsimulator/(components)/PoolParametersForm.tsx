"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";

export default function PoolParametersForm() {
  const { initialData, setInitialData, newPoolImportedFlag } = useStableSwap();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const inputParameters = (field: keyof AnalysisData) => {
    const label = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    if (field == "tokens") return; // TODO: BAL 386
    return {
      ...register(field, { required: true, value: initialData?.[field] }),
      label: label.charAt(0).toUpperCase() + label.slice(1),
      type: "number",
      placeholder: `Define the initial ${label}`,
      value: initialData?.[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          e.target.value == "" ? undefined : parseFloat(e.target.value);
        if (value == undefined) {
          setInitialData({
            ...initialData,
            [field]: undefined,
          });
          return;
        }
        if (value < 0) return;
        setInitialData({
          ...initialData,
          [field]: value,
        });
      },
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
        <div className="flex flex-col gap-2">
          <Input {...inputParameters("swapFee")} />
          {errors.swapFee && (
            <p className="text-sm text-tomato10">This field is required</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input {...inputParameters("ampFactor")} />
          {errors.ampFactor && (
            <p className="text-sm text-tomato10">This field is required</p>
          )}
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
    </form>
  );
}
