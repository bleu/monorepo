import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
import { usePoolFormContext } from "#/contexts/FormContext";
import { AnalysisData } from "#/contexts/PoolSimulatorContext";
import {
  ECLPSimulatorDataSchema,
  StableSwapSimulatorDataSchema,
} from "#/lib/schema";

import { CombinedParams, PoolTypeEnum } from "../(types)";
import { TokenTable } from "./TokenTable";

const schemaMapper = {
  [PoolTypeEnum.MetaStable]: StableSwapSimulatorDataSchema,
  [PoolTypeEnum.GyroE]: ECLPSimulatorDataSchema,
};

interface IInput {
  name: keyof CombinedParams;
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

export function PoolParamsForm({
  extraOnSubmit,
}: {
  extraOnSubmit?: (data: AnalysisData) => void;
}) {
  const { data, setData } = usePoolFormContext();

  const form = useForm({
    resolver: zodResolver(schemaMapper[data.poolType]),
    mode: "onSubmit",
  });
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = form;

  const onSubmit = (fieldData: FieldValues) => {
    const dataWithPoolType = {
      poolParams: Object.fromEntries(
        inputMapper[data.poolType].map((input) => [
          input.name,
          fieldData[input.name],
        ])
      ),
      tokens: data.tokens,
      poolType: data.poolType,
    };

    setData(dataWithPoolType as AnalysisData);
    extraOnSubmit?.(dataWithPoolType as AnalysisData);
  };

  useEffect(() => {
    clearErrors();
    if (data == getValues() || !data.poolType) return;
    inputMapper[data.poolType].forEach((input) => {
      const dataValue = data.poolParams?.[input.name];
      if (dataValue) {
        setValue(input.name, dataValue);
      }
    });
    if (data?.tokens) setValue("tokens", data?.tokens);
  }, [data.poolParams, data.tokens]);

  useEffect(() => {
    function resetForm() {
      clearErrors();
      Object.entries(inputMapper).forEach(([, value]) => {
        value.forEach((input) => {
          setValue(input.name, undefined);
        });
      });
    }
    document.addEventListener("onChangePoolType", resetForm);
    return () => {
      document.removeEventListener("onChangePoolType", resetForm);
    };
  }, []);

  useEffect(() => {
    register("tokens", { required: true, value: data?.tokens });
  }, []);
  return (
    <Form {...form} onSubmit={onSubmit} id="initial-data-form">
      <div className="flex flex-col gap-4">
        {inputMapper[data.poolType].map((input) => (
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
                  defaultValue={data.poolParams?.[input.name]}
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
