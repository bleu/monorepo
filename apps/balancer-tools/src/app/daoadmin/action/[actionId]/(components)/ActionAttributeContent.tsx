"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "#/components";
import { Badge } from "#/components/Badge";
import { Input } from "#/components/Input";
import { Form } from "#/components/ui/form";
import { useAdminTools } from "#/contexts/AdminToolsContext";
import useDebounce from "#/hooks/useDebounce";
import { gauges, pools } from "#/lib/gql";
import { truncateAddress } from "#/utils/truncate";
import { useNetwork } from "#/wagmi";

export function ActionAttributeContent() {
  const form = useForm({
    mode: "onBlur",
  });
  const { register, watch } = form;

  const { push } = useRouter();
  const { selectedAction } = useAdminTools();

  const poolId = watch("poolId");
  const gaugeId = watch("gaugeId");
  const debouncedPoolId = useDebounce(poolId);
  const debouncedGaugeId = useDebounce(gaugeId);

  //TODO fetch selectedAction data from action Id once the backend exists #BAL-157
  React.useEffect(() => {
    if (selectedAction?.name === "") {
      push("/daoadmin");
    }
  }, [push, selectedAction]);

  const { chain } = useNetwork();

  const { data: poolResult } = pools.gql(chain!.id.toString()).usePool(
    { poolId: debouncedPoolId },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 3_600_000,
    },
  );

  const { data: gaugeResult } = gauges.gql(chain!.id.toString()).useGauge(
    { gaugeId: debouncedGaugeId },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 3_600_000,
    },
  );

  function Symbol({ fieldKey }: { fieldKey: string }) {
    if (fieldKey === `poolId`) {
      return (
        <>
          {poolResult?.pool?.symbol && (
            <span>Pool Symbol: {poolResult?.pool?.symbol}</span>
          )}
        </>
      );
    }
    if (fieldKey === `gaugeId`) {
      return (
        <>
          {gaugeResult?.liquidityGauge?.symbol && (
            <span>Gauge Symbol: {gaugeResult?.liquidityGauge?.symbol}</span>
          )}
        </>
      );
    }
    return <></>;
  }

  return (
    // eslint-disable-next-line no-console
    <Form onSubmit={(data: unknown) => console.log(data)} {...form}>
      {selectedAction?.name && (
        <div className="w-full">
          <div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="mx-1 text-2xl font-medium text-slate12">
                  {selectedAction?.name}
                </h1>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-6 rounded-md border border-slate6 bg-blue3 p-6">
              <p className="text-slate12">{selectedAction?.description}</p>
              <div className="mt-2 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  Operation Responsible
                  <Badge>{selectedAction?.operationResponsible}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  Contract Address
                  <a
                    href={selectedAction?.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate12 hover:underline"
                  >
                    {truncateAddress(selectedAction?.contractAddress)}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {selectedAction?.fields.map((field) => {
                  return (
                    <div key={field.key}>
                      <Input
                        label={field.label}
                        placeholder={field.placeholder}
                        {...register(field.key, {
                          validate: field?.getValidations?.(chain),
                        })}
                      />
                      <Symbol fieldKey={field.key} />
                    </div>
                  );
                })}
              </div>
              <Button type="submit" disabled={false}>
                Submit to Gnosis Safe Signers
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}
