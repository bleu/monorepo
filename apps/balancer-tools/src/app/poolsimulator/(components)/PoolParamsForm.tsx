import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Form, FormField } from "#/components/ui/form";
import { usePoolFormContext } from "#/contexts/FormContext";
import {
  AnalysisData,
  DataType,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
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
  transformFromDataToForm: (n: number | undefined) => number | undefined;
  transformFromFormToData: (n: number | undefined) => number | undefined;
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
      transformFromDataToForm: (n) => (n ? n * 100 : undefined),
      transformFromFormToData: (n) => (n ? n / 100 : undefined),
    },
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
    {
      name: "swapFee",
      label: "Swap Fee",
      placeholder: "Enter swap fee",
      unit: "%",
      transformFromDataToForm: (n) => (n ? n * 100 : undefined),
      transformFromFormToData: (n) => (n ? n / 100 : undefined),
    },
    {
      name: "alpha",
      label: "Alpha",
      placeholder: "Enter alpha",
      unit: "",
      transformFromDataToForm: (n) => n,
      transformFromFormToData: (n) => n,
    },
    {
      name: "beta",
      label: "Beta",
      placeholder: "Enter beta",
      unit: "",
      transformFromDataToForm: (n) => n,
      transformFromFormToData: (n) => n,
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
};

export function PoolParamsForm() {
  const { push } = useRouter();
  const { data, setData, isCustomData } = usePoolFormContext();
  const { tabValue, setCustomData, setTabValue, setIsGraphLoading } =
    usePoolSimulator();

  const form = useForm({
    resolver: zodResolver(schemaMapper[data.poolType]),
    mode: "onChange",
  });
  const {
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = form;

  const getOnSubmit = (tabClicked: boolean) => (fieldData: FieldValues) => {
    const hasNullData = inputMapper[data.poolType].reduce(
      (sum, input) => sum || !fieldData[input.name],
      false
    );
    if (Object.keys(errors).length || hasNullData) return;
    const dataWithPoolType = {
      poolParams: Object.fromEntries(
        inputMapper[data.poolType].map((input) => [
          input.name,
          input.transformFromFormToData(fieldData[input.name]),
        ])
      ),
      tokens: fieldData.tokens,
      poolType: data.poolType,
    };
    setData(dataWithPoolType as AnalysisData);
    if (tabValue === DataType.initialData) {
      setCustomData(dataWithPoolType as AnalysisData);
      setTabValue(DataType.customData);
    } else if (!tabClicked) {
      setIsGraphLoading(true);
      push("/poolsimulator/analysis");
    }
  };

  function checkDataIsEqualForm() {
    const fieldData = watch();
    const dataTransformed = {
      poolParams: Object.fromEntries(
        inputMapper[data.poolType].map((input) => [
          input.name,
          input.transformFromDataToForm(fieldData[input.name]),
        ])
      ),
      tokens: fieldData.tokens,
      poolType: data.poolType,
    };
    return JSON.stringify(dataTransformed) == JSON.stringify(data);
  }

  useEffect(() => {
    clearErrors();
    if (checkDataIsEqualForm() || !data.poolType) return;
    inputMapper[data.poolType].forEach((input) => {
      const dataValue = data.poolParams?.[input.name];
      if (dataValue) {
        setValue(input.name, input.transformFromDataToForm(dataValue));
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
    document.addEventListener("changePoolType", resetForm);
    return () => {
      document.removeEventListener("changePoolType", resetForm);
    };
  }, []);

  useEffect(() => {
    register("tokens", { required: true, value: data?.tokens });
  }, []);

  useEffect(() => {
    const saveData = () => {
      const fieldData = watch();
      getOnSubmit(true)(fieldData);
    };
    const eventName = isCustomData
      ? "clickInitialDataTab"
      : "clickCustomDataTab";
    document.addEventListener(eventName, saveData);
    return () => {
      document.removeEventListener(eventName, saveData);
    };
  }, [data, errors]);

  return (
    <Form {...form} onSubmit={getOnSubmit(false)} id="initial-data-form">
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
                  defaultValue={input.transformFromDataToForm(
                    data.poolParams?.[input.name]
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
