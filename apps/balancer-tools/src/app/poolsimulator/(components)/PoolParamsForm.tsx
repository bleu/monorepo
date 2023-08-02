import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
import {
  AnalysisData,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import {
  Gyro2SimulatorDataSchema,
  Gyro3SimulatorDataSchema,
  GyroESimulatorDataSchema,
  StableSwapSimulatorDataSchema,
} from "#/lib/schema";

import { CombinedParams, PoolTypeEnum } from "../(types)";
import { TokenTable } from "./TokenTable";

const schemaMapper = {
  [PoolTypeEnum.MetaStable]: StableSwapSimulatorDataSchema,
  [PoolTypeEnum.GyroE]: GyroESimulatorDataSchema,
  [PoolTypeEnum.Gyro2]: Gyro2SimulatorDataSchema,
  [PoolTypeEnum.Gyro3]: Gyro3SimulatorDataSchema,
};

interface IInput {
  name: keyof CombinedParams;
  label: string;
  placeholder: string;
  unit: string;
  transformFromDataToForm: (n?: number) => number | undefined;
  transformFromFormToData: (n?: number) => number | undefined;
}

type InputMapperType = {
  [key: string]: IInput[];
};

const swapFeeInput = {
  name: "swapFee" as const,
  label: "Swap Fee",
  placeholder: "Enter swap fee",
  unit: "%",
  transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
  transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
};

const inputMapper: InputMapperType = {
  [PoolTypeEnum.MetaStable]: [
    swapFeeInput,
    {
      name: "ampFactor",
      label: "Amplification Factor",
      placeholder: "Enter amplification factor",
      unit: "",
      transformFromDataToForm: (n) => n,
      transformFromFormToData: (n) => n,
    },
  ],
  [PoolTypeEnum.GyroE]: [
    swapFeeInput,
    {
      name: "alpha" as const,
      label: "Alpha",
      placeholder: "Enter alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "beta" as const,
      label: "Beta",
      placeholder: "Enter beta",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "lambda",
      label: "Lambda",
      placeholder: "Enter lambda",
      unit: "",
      transformFromDataToForm: (n) => n,
      transformFromFormToData: (n) => n,
    },
    {
      name: "c",
      label: "C",
      placeholder: "Enter c",
      unit: "",
      transformFromDataToForm: (n) => n,
      transformFromFormToData: (n) => n,
    },
    {
      name: "s",
      label: "S",
      placeholder: "Enter s",
      unit: "",
      transformFromDataToForm: (n) => n,
      transformFromFormToData: (n) => n,
    },
  ],
  [PoolTypeEnum.Gyro2]: [
    swapFeeInput,
    {
      name: "sqrtAlpha" as const,
      label: "Alpha",
      placeholder: "Enter alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 2 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 2) : undefined),
    },
    {
      name: "sqrtBeta" as const,
      label: "Beta",
      placeholder: "Enter beta",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 2 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 2) : undefined),
    },
  ],
  [PoolTypeEnum.Gyro3]: [
    swapFeeInput,
    {
      name: "root3Alpha" as const,
      label: "Alpha",
      placeholder: "Enter alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 3 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 3) : undefined),
    },
  ],
};

export function PoolParamsForm() {
  const { push } = useRouter();
  const {
    setIsGraphLoading,
    setInitialData,
    setCustomData,
    initialData,
    poolType,
  } = usePoolSimulator();

  const form = useForm({
    resolver: zodResolver(schemaMapper[poolType]),
    mode: "onSubmit",
  });
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = form;

  const onSubmit = (data: FieldValues) => {
    setIsGraphLoading(true);
    const dataWithPoolType = {
      poolParams: Object.fromEntries(
        inputMapper[poolType].map((input) => [
          input.name,
          input.transformFromFormToData(data[input.name]),
        ])
      ),
      tokens: data.tokens,
      poolType: data.poolType,
    };

    setInitialData(dataWithPoolType as AnalysisData);
    setCustomData(dataWithPoolType as AnalysisData);
    push("/poolsimulator/analysis");
  };

  useEffect(() => {
    clearErrors();
    if (initialData == getValues() || !poolType) return;
    inputMapper[poolType].forEach((input) => {
      const dataValue = initialData.poolParams?.[input.name];
      if (dataValue) {
        setValue(input.name, input.transformFromDataToForm(dataValue));
      }
    });
    if (initialData?.tokens) setValue("tokens", initialData?.tokens);
  }, [initialData]);

  useEffect(() => {
    clearErrors();
    Object.entries(inputMapper).forEach(([, value]) => {
      value.forEach((input) => {
        setValue(input.name, undefined);
      });
    });
    setInitialData({
      poolParams: undefined,
      tokens: [],
      poolType: poolType,
    });
  }, [poolType]);

  useEffect(() => {
    register("tokens", { required: true, value: initialData?.tokens });
  }, []);
  return (
    <Form {...form} onSubmit={onSubmit} id="initial-data-form">
      <div className="flex flex-col gap-3">
        {inputMapper[poolType].map((input) => (
          <div className="relative">
            <FormField
              name={input.name}
              render={({ field }) => (
                <Input
                  {...field}
                  label={input.label}
                  type="number"
                  validation={{
                    required: true,
                    valueAsNumber: true,
                    value: initialData.poolParams?.[input.name],
                  }}
                  defaultValue={initialData.poolParams?.[input.name]}
                  placeholder={input.placeholder}
                />
              )}
            />
            <span className="absolute top-8 right-2 flex items-center text-slate10">
              {input.unit}
            </span>
          </div>
        ))}
        <div className="flex flex-col">
          <label className="mb-2 block text-sm text-slate12">Tokens</label>
          {errors?.tokens?.message && (
            <div className="mt-1 h-6 text-sm text-tomato10">
              <span>{errors?.tokens?.message as string}</span>
            </div>
          )}
          <TokenTable />
        </div>
        {errors[""] && (
          <span className="text-tomato10">{errors[""]?.message as string}</span>
        )}
        <Button type="submit" shade="light" className="h-min w-32 self-end">
          Next step
        </Button>
      </div>
    </Form>
  );
}
