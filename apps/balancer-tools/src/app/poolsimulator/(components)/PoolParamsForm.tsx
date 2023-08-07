import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { type FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { useTabContext } from "#/components/Tabs";
import { Form, FormField } from "#/components/ui/form";
import { type AnalysisData } from "#/contexts/PoolSimulatorContext";
import {
  Gyro2SimulatorDataSchema,
  Gyro3SimulatorDataSchema,
  GyroESimulatorDataSchema,
  StableSwapSimulatorDataSchema,
} from "#/lib/schema";

import { PoolTypeEnum } from "../(types)";
import { TokenTable } from "./TokenTable";

const schemaMapper = {
  [PoolTypeEnum.MetaStable]: StableSwapSimulatorDataSchema,
  [PoolTypeEnum.GyroE]: GyroESimulatorDataSchema,
  [PoolTypeEnum.Gyro2]: Gyro2SimulatorDataSchema,
  [PoolTypeEnum.Gyro3]: Gyro3SimulatorDataSchema,
};

const inputMapper = {
  [PoolTypeEnum.MetaStable]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "ampFactor",
      label: "Amplification Factor",
      placeholder: "Enter amplification factor",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
  ],
  [PoolTypeEnum.GyroE]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "alpha",
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
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "c",
      label: "C",
      placeholder: "Enter c",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "s",
      label: "S",
      placeholder: "Enter s",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
  ],
  [PoolTypeEnum.Gyro2]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
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
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "root3Alpha" as const,
      label: "Alpha",
      placeholder: "Enter alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 3 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 3) : undefined),
    },
  ],
} as const;

const createPayload = (
  poolType: keyof typeof inputMapper,
  fieldData: FieldValues,
): AnalysisData => ({
  poolParams: Object.fromEntries(
    inputMapper[poolType].map((input) => [
      input.name,
      input.transformFromFormToData(fieldData[input.name]),
    ]),
  ),
  tokens: fieldData.tokens,
  poolType: poolType,
});

type PoolParamsFormProps = {
  defaultValue: AnalysisData;
  onSubmit: (data: AnalysisData) => void;
  onTabChanged?: (data: AnalysisData) => void;
  submitButtonText?: string;
};

export const PoolParamsForm = forwardRef<unknown, PoolParamsFormProps>(
  ({ defaultValue: data, onSubmit, onTabChanged, submitButtonText }, ref) => {
    const poolType = data.poolType || PoolTypeEnum.MetaStable;

    const form = useForm({
      resolver: zodResolver(schemaMapper[poolType]),
      mode: "onSubmit",
    });

    const {
      register,
      setValue,
      clearErrors,
      formState: { errors },
      getValues,
      trigger,
    } = form;

    useImperativeHandle(ref, () => ({
      triggerValidation: () => {
        trigger();
      },
    }));

    useEffect(() => {
      clearErrors();
      if (!poolType) return;

      // Reset the form whenever poolType changes
      Object.entries(inputMapper).forEach(([, value]) => {
        value.forEach((input) => {
          setValue(input.name, undefined);
        });
      });

      inputMapper[poolType].forEach((input) => {
        const dataValue = data.poolParams?.[input.name];
        if (dataValue) {
          setValue(input.name, input.transformFromDataToForm(dataValue));
        }
      });
      if (data?.tokens) setValue("tokens", data?.tokens);
    }, [clearErrors, data.poolParams, data?.tokens, poolType, setValue]);

    useEffect(() => {
      register("tokens", { required: true, value: data?.tokens });
    }, [data?.tokens, register]);

    const { value: currentTab } = useTabContext();

    useEffect(() => {
      const data = getValues();
      onTabChanged?.(createPayload(poolType, data));
    }, [currentTab, getValues, onTabChanged, poolType]);

    return (
      <Form
        {...form}
        onSubmit={(data) => onSubmit(createPayload(poolType, data))}
        id="initial-data-form"
      >
        <div className="flex flex-col gap-4">
          {inputMapper[poolType].map((input) => (
            <div className="relative" key={input.name}>
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
                      value: data.poolParams?.[input.name],
                    }}
                    defaultValue={input.transformFromDataToForm(
                      data.poolParams?.[input.name],
                    )}
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
            <TokenTable data={data} />
          </div>
          {errors[""] && (
            <span className="text-tomato10">
              {errors[""]?.message as string}
            </span>
          )}
          <Button type="submit" shade="light" className="h-min self-end">
            {submitButtonText || "Next step"}
          </Button>
        </div>
      </Form>
    );
  },
);

PoolParamsForm.displayName = "PoolParamsForm";
