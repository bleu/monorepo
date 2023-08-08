import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { useTabContext } from "#/components/Tabs";
import { Form, FormField } from "#/components/ui/form";
import { AnalysisData } from "#/contexts/PoolSimulatorContext";
import {
  FxSchema,
  Gyro2Schema,
  Gyro3Schema,
  GyroESchema,
  StableSwapSimulatorDataSchema,
} from "#/lib/schema";

import { PoolTypeEnum } from "../(types)";
import { TokenTable } from "./TokenTable";

const schemaMapper = {
  [PoolTypeEnum.MetaStable]: StableSwapSimulatorDataSchema,
  [PoolTypeEnum.GyroE]: GyroESchema,
  [PoolTypeEnum.Gyro2]: Gyro2Schema,
  [PoolTypeEnum.Gyro3]: Gyro3Schema,
  [PoolTypeEnum.Fx]: FxSchema,
};

const inputMapper = {
  [PoolTypeEnum.MetaStable]: [
    {
      name: "swapFee",
      label: "Swap Fee",

      unit: "%",
      transformFromDataToForm: (n?: number) =>
        typeof n === "number" ? n * 100 : undefined,
      transformFromFormToData: (n?: number) =>
        typeof n === "number" ? n / 100 : undefined,
    },
    {
      name: "ampFactor",
      label: "Amplification Factor",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
  ],
  [PoolTypeEnum.GyroE]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      unit: "%",
      transformFromDataToForm: (n?: number) =>
        typeof n === "number" ? n * 100 : undefined,
      transformFromFormToData: (n?: number) =>
        typeof n === "number" ? n / 100 : undefined,
    },
    {
      name: "alpha",
      label: "Alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "beta" as const,
      label: "Beta",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "lambda",
      label: "Lambda",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "c",
      label: "C",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
    {
      name: "s",
      label: "S",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
    },
  ],
  [PoolTypeEnum.Gyro2]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      unit: "%",
      transformFromDataToForm: (n?: number) =>
        typeof n === "number" ? n * 100 : undefined,
      transformFromFormToData: (n?: number) =>
        typeof n === "number" ? n / 100 : undefined,
    },
    {
      name: "sqrtAlpha" as const,
      label: "Alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 2 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 2) : undefined),
    },
    {
      name: "sqrtBeta" as const,
      label: "Beta",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 2 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 2) : undefined),
    },
  ],
  [PoolTypeEnum.Gyro3]: [
    {
      name: "swapFee",
      label: "Swap Fee",

      unit: "%",
      transformFromDataToForm: (n?: number) => {
        return typeof n === "number" ? n * 100 : undefined;
      },
      transformFromFormToData: (n?: number) =>
        typeof n === "number" ? n / 100 : undefined,
    },
    {
      name: "root3Alpha" as const,
      label: "Alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 3 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 3) : undefined),
    },
  ],
  [PoolTypeEnum.Fx]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      unit: "%",
      transformFromDataToForm: (n?: number) => {
        return typeof n === "number" ? n * 100 : undefined;
      },
      transformFromFormToData: (n?: number) =>
        typeof n === "number" ? n / 100 : undefined,
    },
    {
      name: "alpha",
      label: "Alpha",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "beta" as const,
      label: "Beta",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "lambda",
      label: "Lambda",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "delta",
      label: "Delta",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
    },
    {
      name: "epsilon",
      label: "Epsilon",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
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
        if (dataValue !== undefined) {
          setValue(input.name, input.transformFromDataToForm(dataValue));
        }
      });
      if (data?.tokens) setValue("tokens", data?.tokens);
    }, [data.poolParams, data.tokens, poolType]);

    useEffect(() => {
      register("tokens", { required: true, value: data?.tokens });
    }, []);

    const { value: currentTab } = useTabContext();

    useEffect(() => {
      const data = getValues();
      onTabChanged?.(createPayload(poolType, data));
    }, [currentTab]);

    return (
      <Form
        {...form}
        onSubmit={(data) => onSubmit(createPayload(poolType, data))}
        id="initial-data-form"
      >
        <div className="flex flex-col gap-4">
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
                      value: data.poolParams?.[input.name],
                    }}
                    defaultValue={input.transformFromDataToForm(
                      data.poolParams?.[input.name],
                    )}
                    placeholder={`Enter ${input.label}`}
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
