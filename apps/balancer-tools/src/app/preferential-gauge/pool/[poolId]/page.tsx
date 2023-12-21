"use client";
import { NetworkChainId } from "@bleu-fi/utils";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "#/components";
import { Select, SelectItem } from "#/components/Select";
import { Form } from "#/components/ui/form";
import { gauges } from "#/lib/gql";
import { truncateAddress } from "#/utils/truncate";

export default function Page({ params }: { params: { poolId: string } }) {
  const form = useForm();
  const { data } = gauges
    .gql(`${NetworkChainId.ETHEREUM}`)
    .usePoolPreferentialGauge({ poolId: params.poolId });

  const gaugesInfo = data?.pools[0].gauges;
  const preferentialGauge = {
    address: data?.pools[0].preferentialGauge?.id,
    symbol: gaugesInfo?.find(
      (item) =>
        item.gauge?.liquidityGauge?.id === data?.pools[0].preferentialGauge?.id,
    )?.gauge?.liquidityGauge?.symbol,
  };

  useEffect(() => {
    if (data?.pools[0].preferentialGauge?.id) {
      form.register("oldPreferentialGauge");
      form.setValue(
        "oldPreferentialGauge",
        data?.pools[0].preferentialGauge?.id,
      );
      form.setValue("preferentialGauge", data?.pools[0].preferentialGauge?.id);
    }
  }, [data]);

  function onSubmit() {
    console.log("handle contract call");
  }

  return (
    <div className="text-slate12 py-12 flex flex-col gap-y-6">
      <span>Pool ID: {params.poolId}</span>
      {!preferentialGauge.address ? (
        <span>
          No current preferential gauge has been set, or the existing
          preferential gauge has been killed
        </span>
      ) : (
        <p>
          Current preferential gauge: {preferentialGauge.symbol}{" "}
          {preferentialGauge.address}
        </p>
      )}
      <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-2">
        <span>Set Preferential Gauge</span>
        <Controller
          control={form.control}
          name="preferentialGauge"
          render={({ field: { onChange, value, ref } }) => (
            <Select onValueChange={onChange} value={value} ref={ref}>
              {data?.pools[0].gauges?.map((item) => {
                return (
                  <SelectItem
                    key={item.gauge?.liquidityGauge?.id}
                    value={item.gauge?.liquidityGauge?.id as string}
                  >
                    {item.gauge?.liquidityGauge?.symbol
                      ? `${item.gauge?.liquidityGauge
                          ?.symbol}-${truncateAddress(
                          item.gauge?.liquidityGauge?.id,
                        )}`
                      : "Preferential Gauge was killed"}
                  </SelectItem>
                );
              })}
            </Select>
          )}
        />
        <div>
          <Button type="submit" className="p-2">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
