"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNetwork } from "wagmi";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { useAdminTools } from "#/contexts/AdminToolsContext";
import { fetchExistingPool } from "#/utils/fetcher";
import { toCamelCase } from "#/utils/formatStringCase";
import { truncateAddress } from "#/utils/truncateAddress";

export function ActionAttributeContent() {
  const { register, handleSubmit, watch } = useForm();
  // eslint-disable-next-line no-console
  const onSubmit = (data: unknown) => console.log(data);
  const { push } = useRouter();
  const { selectedAction } = useAdminTools();
  const { chain } = useNetwork();
  const [poolName, setPoolName] = React.useState<string>();
  const [poolError, setPoolError] = React.useState<string>();

  const poolId = watch("poolID");

  React.useEffect(() => {
    if (!poolId) {
      setPoolName("");
      setPoolError("");
      return;
    }
    const couldInputBePoolId = /^(0x){1}[0-9a-f]{64}/i.test(poolId);
    if (!couldInputBePoolId) {
      setPoolName("");
      setPoolError("Pool not found. Please insert an existing Pool ID");
      return;
    }
    fetchExistingPool(poolId, chain?.id.toString() || "1").then((response) =>
      setPoolName(response.pool?.symbol as string)
    );
  }, [poolId]);

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
                        {...register(toCamelCase(`${field.name}`))}
                      />
                      <div className="mt-2 flex gap-1 text-sm text-gray-400">
                        {field.name === "Pool ID" && poolName ? (
                          <>
                            <h1 className="text-white">Pool Name:</h1>
                            <h1>{poolName}</h1>
                          </>
                        ) : field.name === "Pool ID" && poolError ? (
                          <h1>{poolError}</h1>
                        ) : (
                          <></>
                        )}
                      </div>
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
