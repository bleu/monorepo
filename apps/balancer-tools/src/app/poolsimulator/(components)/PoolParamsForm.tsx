import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Slider } from "#/components/Slider";
import { useTabContext } from "#/components/Tabs";
import { Form, FormField } from "#/components/ui/form";
import { AnalysisData } from "#/contexts/PoolSimulatorContext";
import {
  FxSchema,
  Gyro2Schema,
  Gyro3Schema,
  GyroESchema,
  MetaStableSchema,
} from "#/lib/schema";

import { PoolTypeEnum } from "../(types)";
import { TokenTable } from "./TokenTable";

const schemaMapper = {
  [PoolTypeEnum.MetaStable]: MetaStableSchema,
  [PoolTypeEnum.GyroE]: GyroESchema,
  [PoolTypeEnum.Gyro2]: Gyro2Schema,
  [PoolTypeEnum.Gyro3]: Gyro3Schema,
  [PoolTypeEnum.Fx]: FxSchema,
};

const docsMapper = {
  [PoolTypeEnum.MetaStable]:
    "https://docs.balancer.fi/reference/math/stable-math.html",
  [PoolTypeEnum.GyroE]:
    "https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps",
  [PoolTypeEnum.Gyro2]:
    "https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/2-clps",
  [PoolTypeEnum.Gyro3]:
    "https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/3-clps",
  [PoolTypeEnum.Fx]: "https://docs.xave.co/product-overview-1/fxpools",
};

const dynamicGetMinMaxAndStep = {
  getMin: (n?: number) => (n ? n / 100 : 0.01),
  getMax: (n?: number) => (n ? n * 10 : 0.01),
  getStep: (n?: number) => (n ? n / 100 : 0.01),
} as const;

const SwapFeeInput = {
  name: "swapFee",
  label: "Swap Fee",
  unit: "%",
  transformFromDataToForm: (n?: number) =>
    typeof n === "number" ? n * 100 : undefined,
  transformFromFormToData: (n?: number) =>
    typeof n === "number" ? n / 100 : undefined,
  tooltip: "Percentage fee charged on swaps",
  getMin: (_n?: number) => 0,
  getMax: (_n?: number) => 10,
  getStep: (_n?: number) => 0.001,
} as const;

const inputMapper = {
  [PoolTypeEnum.MetaStable]: [
    SwapFeeInput,
    {
      name: "ampFactor",
      label: "Amplification Factor",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
      tooltip:
        "Balance the constant-sum and constant-product AMMs. The higher the value, the closer the AMM behavior is to constant-sum",
      ...dynamicGetMinMaxAndStep,
    },
  ],
  [PoolTypeEnum.GyroE]: [
    SwapFeeInput,
    {
      name: "alpha",
      label: "Alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
      tooltip: "Lower price bound considering token 2 / token 1",
      ...dynamicGetMinMaxAndStep,
    },
    {
      name: "beta" as const,
      label: "Beta",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
      tooltip: "Upper price bound considering token 2 / token 1",
      ...dynamicGetMinMaxAndStep,
    },
    {
      name: "lambda",
      label: "Lambda",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
      tooltip: "Stretching factor. 1 implies a circle",
      ...dynamicGetMinMaxAndStep,
    },
    {
      name: "c",
      label: "C",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
      tooltip: "First coordinate of rotation point",
      getMin: (_n?: number) => 0.01,
      getMax: (_n?: number) => 1,
      getStep: (_n?: number) => 0.01,
    },
    {
      name: "s",
      label: "S",
      unit: "",
      transformFromDataToForm: (n?: number) => n,
      transformFromFormToData: (n?: number) => n,
      tooltip: "Second coordinate of rotation point",
      getMin: (_n?: number) => 0.01,
      getMax: (_n?: number) => 1,
      getStep: (_n?: number) => 0.01,
    },
  ],
  [PoolTypeEnum.Gyro2]: [
    SwapFeeInput,
    {
      name: "sqrtAlpha" as const,
      label: "Alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 2 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 2) : undefined),
      tooltip: "Lower price bound considering token 2 / token 1",
      ...dynamicGetMinMaxAndStep,
    },
    {
      name: "sqrtBeta" as const,
      label: "Beta",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 2 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 2) : undefined),
      tooltip: "Upper price bound considering token 2 / token 1",
      ...dynamicGetMinMaxAndStep,
    },
  ],
  [PoolTypeEnum.Gyro3]: [
    SwapFeeInput,
    {
      name: "root3Alpha" as const,
      label: "Alpha",
      unit: "",
      transformFromDataToForm: (n?: number) => (n ? n ** 3 : undefined),
      transformFromFormToData: (n?: number) => (n ? n ** (1 / 3) : undefined),
      tooltip: "Lower bound of the price range",
      ...dynamicGetMinMaxAndStep,
    },
  ],
  [PoolTypeEnum.Fx]: [
    SwapFeeInput,
    {
      name: "alpha",
      label: "Alpha",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
      tooltip: "Maximum and minimum allocation of each reserve",
      getMin: (_n?: number) => 55,
      getMax: (_n?: number) => 100,
      getStep: (_n?: number) => 1,
    },
    {
      name: "beta" as const,
      label: "Beta",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
      tooltip: "Depth of liquidity pool without price slippage",
      getMin: (_n?: number) => 0,
      getMax: (_n?: number) => 100,
      getStep: (_n?: number) => 1,
    },
    {
      name: "delta",
      label: "Delta",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
      tooltip: "Rate of price change",
      getMin: (_n?: number) => 0,
      getMax: (_n?: number) => 100,
      getStep: (_n?: number) => 1,
    },
    {
      name: "epsilon",
      label: "Epsilon",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
      tooltip: "Fixed fee",
      getMin: (_n?: number) => 0,
      getMax: (_n?: number) => 10,
      getStep: (_n?: number) => 0.001,
    },
    {
      name: "lambda",
      label: "Lambda",
      unit: "%",
      transformFromDataToForm: (n?: number) => (n ? n * 100 : undefined),
      transformFromFormToData: (n?: number) => (n ? n / 100 : undefined),
      tooltip: "Dynamic fee",
      getMin: (_n?: number) => 0,
      getMax: (_n?: number) => 50,
      getStep: (_n?: number) => 1,
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
          {inputMapper[poolType].map((input) => {
            const defaultValue = input.transformFromDataToForm(
              data.poolParams?.[input.name],
            );
            return (
              <FormField
                name={input.name}
                render={() => (
                  <Slider
                    name={input.name}
                    label={input.label}
                    validation={{
                      required: true,
                      valueAsNumber: true,
                      value: data.poolParams?.[input.name],
                    }}
                    defaultValue={defaultValue}
                    tooltipText={input.tooltip}
                    tooltipLink={docsMapper[poolType]}
                    min={input.getMin(defaultValue)}
                    max={input.getMax(defaultValue)}
                    step={input.getStep(defaultValue)}
                    unit={input.unit}
                  />
                )}
              />
            );
          })}
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
