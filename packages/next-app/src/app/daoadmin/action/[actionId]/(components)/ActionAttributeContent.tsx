"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNetwork } from "wagmi";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { useAdminTools } from "#/contexts/AdminToolsContext";
import gaugeGql from "#/lib/gaugesGql";
import poolGql from "#/lib/gql";
import { truncateAddress } from "#/utils/truncateAddress";

interface IChekedInputs {
  pool: {
    symbol: string;
    error: string;
  };
  gauge: {
    symbol: string;
    error: string;
  };
}

export function ActionAttributeContent() {
  const { register, handleSubmit, watch } = useForm({ mode: "onChange" });
  // eslint-disable-next-line no-console
  const onSubmit = (data: unknown) => console.log(data);
  const { push } = useRouter();
  const { selectedAction } = useAdminTools();
  const [inputValues, setInputValues] = React.useState({ pool: "", gauge: "" });

  const poolId = watch("Pool ID");
  const gaugeID = watch("Gauge ID");

  React.useEffect(() => {
    setInputValues({ pool: poolId, gauge: gaugeID });
  }, [poolId, gaugeID]);

  //TODO fetch selectedAction data from action Id once the backend exists #BAL-157
  React.useEffect(() => {
    if (selectedAction?.name === "") {
      push("/daoadmin");
    }
  }, [selectedAction]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {selectedAction?.name && (
        <div className="w-full">
          <div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="mx-1 text-2xl font-medium text-gray-400">
                  {selectedAction?.name}
                </h1>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-6 rounded-md border border-gray-700 bg-gray-800 p-6">
              <p className="text-gray-400">{selectedAction?.description}</p>
              <div className="mt-2 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  Operation Responsible
                  <span className="rounded bg-blue-200 p-1 text-sm font-bold text-gray-800 group-hover:bg-yellow-100">
                    {selectedAction?.operationResponsible}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  Contract Address
                  <a
                    href={selectedAction?.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:underline"
                  >
                    {truncateAddress(selectedAction?.contractAddress)}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {selectedAction?.fields.map((field) => {
                  return (
                    <div key={field.name}>
                      <Input
                        label={field.name}
                        placeholder={field.placeholder}
                        {...register(field.name, {})}
                      />
                      <ValidateInputs
                        inputValues={inputValues}
                        fieldName={field.name}
                      />
                    </div>
                  );
                })}
              </div>
              <Button
                type="submit"
                disabled={false}
                className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500"
              >
                Submit to Gnosis Safe Signers
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function ValidateInputs({
  inputValues,
  fieldName,
}: {
  inputValues: { pool: string; gauge: string };
  fieldName: string;
}) {
  const { chain } = useNetwork();
  const [checkedInputs, setCheckedInputs] = React.useState<IChekedInputs>({
    pool: { symbol: "", error: "" },
    gauge: { symbol: "", error: "" },
  });

  function changeCheckedInputs(
    input: "pool" | "gauge",
    symbol: string,
    error: string
  ) {
    setCheckedInputs((prevState) => {
      return {
        ...prevState,
        [input]: {
          symbol,
          error,
        },
      };
    });
  }
  const field = fieldName === "Pool ID" ? "pool" : "Gauge ID" ? "gauge" : "";

  if (field === "pool") {
    const { data: poolData } = poolGql(chain!.id.toString()).usePool({
      poolId: inputValues.pool,
    });

    React.useEffect(() => {
      if (!inputValues.pool) {
        changeCheckedInputs(field, "", "");
        return;
      }
      const poolResponse = poolData?.pool;
      if (!poolResponse) {
        changeCheckedInputs(
          field,
          "",
          "Pool not found. Please insert an existing Pool ID"
        );
        return;
      }
      if (!poolResponse.symbol) {
        changeCheckedInputs(
          field,
          "",
          "Looks like we couldn't load this pool symbol. Please try typing again"
        );
      }
      changeCheckedInputs(field, poolResponse.symbol as string, "");
    }, [poolData]);
  }
  if (field === "gauge") {
    const { data: gaugeData } = gaugeGql(chain!.id.toString()).useGauge({
      gaugeId: inputValues.gauge,
    });

    React.useEffect(() => {
      if (!inputValues.gauge) {
        changeCheckedInputs(field, "", "");
        return;
      }
      const liquidityGaugeResponse = gaugeData?.liquidityGauge;
      if (!liquidityGaugeResponse) {
        changeCheckedInputs(
          field,
          "",
          "Gauge not found. Please insert an existing Gauge ID"
        );
        return;
      }
      if (!liquidityGaugeResponse.symbol) {
        changeCheckedInputs(
          field,
          "",
          "Looks like we couldn't load this gauge symbol. Please try typing again"
        );
      }
      changeCheckedInputs(field, liquidityGaugeResponse.symbol as string, "");
    }, [gaugeData]);
  }
  return (
    <div className="mt-2 flex gap-1 text-sm text-gray-400">
      {fieldName === "Pool ID" ? (
        checkedInputs.pool.symbol ? (
          <>
            <h1 className="text-white">Pool Symbol:</h1>
            <h1>{checkedInputs.pool.symbol}</h1>
          </>
        ) : checkedInputs.pool.error ? (
          <h1>{checkedInputs.pool.error}</h1>
        ) : (
          <></>
        )
      ) : fieldName === "Gauge ID" ? (
        checkedInputs.gauge.symbol ? (
          <>
            <h1 className="text-white">Gauge Symbol:</h1>
            <h1>{checkedInputs.gauge.symbol}</h1>
          </>
        ) : checkedInputs.gauge.error ? (
          <h1>{checkedInputs.gauge.error}</h1>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
