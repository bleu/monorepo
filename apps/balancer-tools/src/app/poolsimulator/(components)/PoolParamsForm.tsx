import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
import {
  AnalysisData,
  PoolTypeEnum,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import {
  ECLPSimulatorDataSchema,
  StableSwapSimulatorDataSchema,
} from "#/lib/schema";

const schemaMapper = {
  MetaStable: StableSwapSimulatorDataSchema,
  GyroE: ECLPSimulatorDataSchema,
};

interface IInput {
  name: "swapFee" | "ampFactor" | "alpha" | "beta" | "lambda" | "c" | "s";
  label: string;
  placeholder: string;
  unit: string;
}

type InputMapperType = {
  [key: string]: IInput[];
};

const inputMapper: InputMapperType = {
  [PoolTypeEnum.MetaStable]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
    },
    {
      name: "ampFactor",
      label: "Amplification Factor",
      placeholder: "Enter amplification factor",
      unit: "",
    },
  ],
  [PoolTypeEnum.GyroE]: [
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
    },
    {
      name: "alpha",
      label: "Alpha",
      placeholder: "Enter alpha",
      unit: "",
    },
    {
      name: "beta",
      label: "Beta",
      placeholder: "Enter beta",
      unit: "",
    },
    {
      name: "lambda",
      label: "Lambda",
      placeholder: "Enter lambda",
      unit: "",
    },
    {
      name: "c",
      label: "C",
      placeholder: "Enter c",
      unit: "",
    },
    {
      name: "s",
      label: "S",
      placeholder: "Enter s",
      unit: "",
    },
  ],
};

export function PoolParamsForm() {
  const { push } = useRouter();
  const {
    setIsGraphLoading,
    setCurrentTabTokenByIndex,
    setAnalysisTokenByIndex,
    setInitialData,
    setCustomData,
    initialData,
    poolType,
  } = usePoolSimulator();

  const form = useForm({
    resolver: zodResolver(schemaMapper[poolType]),
    mode: "onSubmit",
  });
  const { register, setValue, getValues, clearErrors } = form;

  const onSubmit = (data: FieldValues) => {
    setIsGraphLoading(true);
    setCustomData(data as AnalysisData);
    setInitialData(data as AnalysisData);
    setAnalysisTokenByIndex(0);
    setCurrentTabTokenByIndex(1);
    push("/poolsimulator/analysis");
  };

  useEffect(() => {
    clearErrors();
    if (initialData == getValues() || !poolType) return;
    inputMapper[poolType].forEach((input) => {
      const dataValue = initialData.poolParams?.[input.name];
      if (dataValue) {
        setValue(input.name, dataValue);
      }
    });
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
        <Button type="submit" shade="light" className="h-min w-32 self-end">
          Next step
        </Button>
      </div>
    </Form>
  );
}
