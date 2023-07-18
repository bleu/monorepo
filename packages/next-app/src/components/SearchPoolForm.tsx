"use client";

import { PoolsWherePoolTypeQuery } from "@bleu-balancer-tools/gql/src/balancer-pools/__generated__/Ethereum";
import { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { pools } from "#/lib/gql";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";
import { truncateAddress } from "#/utils/truncate";

import { Form, FormField, FormLabel } from "./ui/form";

export interface PoolAttribute {
  poolId: string;
  network: string;
}

const inputTypenames = [
  { value: "1", label: "Mainnet" },
  { value: "137", label: "Polygon" },
  { value: "42161", label: "Arbitrum" },
  { value: "5", label: "Goerli" },
];

export function SearchPoolForm({
  close,
  poolTypeFilter,
  onSubmit,
  showPools = false,
}: {
  onSubmit?: (formData: PoolAttribute) => void;
  close?: () => void;
  poolTypeFilter?: string[];
  showPools?: boolean;
}) {
  const [comboBoxIsOpen, setComboBoxIsOpen] = useState(false);
  const form = useForm<PoolAttribute>();
  const {
    register,
    setError,
    watch,
    clearErrors,
    resetField,
    formState: { errors },
  } = form;

  const poolId = watch("poolId");
  const network = watch("network");

  const gqlVariables = {
    poolId: poolId?.toLowerCase(),
    ...(poolTypeFilter?.length ? { poolTypes: poolTypeFilter } : {}),
  };
  const { data: poolsData } = pools
    .gql(network || "1")
    .usePoolsWherePoolTypeInAndId(gqlVariables, { revalidateIfStale: true });

  const { data: poolsDataList, mutate: poolsDataListMutate } = pools
    .gql(network || "1")
    .usePoolsWherePoolType(
      poolTypeFilter?.length ? { poolTypes: poolTypeFilter } : {},
      { revalidateIfStale: true },
    );

  const isPool = !!poolsData?.pools?.length;

  function handleSubmitForm(formData: PoolAttribute) {
    onSubmit?.(formData);
    close?.();
  }

  function filterPoolInput({
    poolSearchQuery,
    pool,
  }: {
    poolSearchQuery: string;
    pool?: ArrElement<GetDeepProp<PoolsWherePoolTypeQuery, "pools">>;
  }) {
    {
      if (!pool) return false;
      const regex = new RegExp(poolSearchQuery, "i");
      return regex.test(Object.values(pool).join(","));
    }
  }

  const filteredPoolList = poolsDataList?.pools
    .filter((pool) => filterPoolInput({ poolSearchQuery: poolId, pool }))
    .sort((a, b) =>
      Number(a!.totalLiquidity) < Number(b!.totalLiquidity) ? 1 : -1,
    );

  useEffect(() => {
    if (poolsData && !poolsData.pools && poolId) {
      setError(
        "poolId",
        {
          type: "notfound",
          message: "Pool not found. Check the Pool ID and network.",
        },
        { shouldFocus: true },
      );
      return;
    } else {
      clearErrors("poolId");
    }
  }, [poolsData]);

  useLayoutEffect(() => {
    poolsDataListMutate();
    resetField("poolId");
  }, [network]);

  function closeCombobox() {
    setTimeout(() => {
      setComboBoxIsOpen(false);
    }, 200);
  }

  return (
    <Form onSubmit={handleSubmitForm} {...form}>
      <div className="space-y-2 px-2 pt-2">
        <div>
          <FormLabel className="mb-2 block text-sm text-slate12">
            Network
          </FormLabel>

          <FormField
            name="network"
            defaultValue="1"
            render={({ field: { onChange, value, ref } }) => (
              <Select onValueChange={onChange} value={value} ref={ref}>
                {inputTypenames.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="relative">
          <Input
            label={!showPools ? "Pool ID" : "Pool Name or ID"}
            placeholder={
              !showPools
                ? "e.g 0x4467a48fjdan...0000692"
                : "Search Pool name or address"
            }
            {...register("poolId")}
            onClick={!showPools ? undefined : () => setComboBoxIsOpen(true)}
            onBlur={!showPools ? undefined : closeCombobox}
          />
          <p className="text-sm text-tomato10">{errors.poolId?.message}</p>
          {comboBoxIsOpen &&
            filteredPoolList &&
            filteredPoolList?.length > 0 && (
              <div className="absolute z-50 my-2 flex max-h-52 flex-col gap-y-2 overflow-y-scroll rounded border-[1px] border-blue6 bg-blue3 scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12">
                <div className="p-2">
                  {filteredPoolList?.map((pool) => (
                    <Button
                      key={pool.id}
                      type="button"
                      className="w-full border-transparent bg-transparent"
                      onClick={() => {
                        resetField("poolId");
                        handleSubmitForm({
                          poolId: pool.id,
                          network: network || "1",
                        });
                      }}
                    >
                      <div className="flex w-full flex-col items-start">
                        <span>{pool.symbol}</span>
                        <div className="flex w-full items-center gap-x-1 text-xs text-slate9">
                          <span>{truncateAddress(pool.id)}</span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Button type="submit" disabled={!isPool || poolId === ""}>
            Go
          </Button>
        </div>
      </div>
    </Form>
  );
}
