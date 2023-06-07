"use client";

import { PoolsWherePoolTypeQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { pools } from "#/lib/gql";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

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

interface PoolSearch extends PoolAttribute {
  poolSearch: string;
}

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
  const {
    register,
    handleSubmit,
    setError,
    control,
    watch,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm<PoolSearch>();

  const poolId = watch("poolId");
  const network = watch("network");
  const poolSearch = watch("poolSearch");

  const gqlVariables = {
    poolId: poolId?.toLowerCase(),
    ...(poolTypeFilter?.length ? { poolTypes: poolTypeFilter } : {}),
  };
  const { data: poolsData } = pools
    .gql(network || "1")
    .usePoolsWherePoolTypeInAndId(gqlVariables, { revalidateIfStale: true });

  const { data: poolsDataList } = pools
    .gql(network || "1")
    .usePoolsWherePoolType(
      poolTypeFilter?.length ? { poolTypes: poolTypeFilter } : {},
      { revalidateIfStale: true }
    );

  const isPool = !!poolsData?.pools?.length;

  function handleSubmitForm(formData: PoolAttribute) {
    onSubmit?.(formData);
    close?.();
  }

  function filterPoolInput({
    poolSearch,
    pool,
  }: {
    poolSearch: string;
    pool?: ArrElement<GetDeepProp<PoolsWherePoolTypeQuery, "pools">>;
  }) {
    {
      if (!pool) return false;
      const regex = new RegExp(poolSearch, "i");
      return regex.test(Object.values(pool).join(","));
    }
  }

  React.useEffect(() => {
    if (poolsData && !poolsData.pools && poolId) {
      setError(
        "poolId",
        {
          type: "notfound",
          message: "Pool not found. Check the Pool ID and network.",
        },
        { shouldFocus: true }
      );
      return;
    } else {
      clearErrors("poolId");
    }
  }, [poolsData]);

  React.useLayoutEffect(() => {
    resetField("poolId");
  }, [network]);

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="px-2 pt-2">
      <label className="mb-2 block text-sm text-slate12">Network</label>
      <div className="mb-2">
        <Controller
          control={control}
          name={"network"}
          defaultValue={"1"}
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
      {!showPools ? (
        <>
          <Input
            label="Pool ID"
            placeholder={"e.g 0x4467a48fjdan...0000692"}
            {...register("poolId")}
          />
          <p className="text-sm text-tomato10">{errors.poolId?.message}</p>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={!isPool || poolId === ""}>
              Go
            </Button>
          </div>
        </>
      ) : (
        <>
          <Input
            label="Pool Name or ID"
            placeholder={"Search name or paste address"}
            {...register("poolSearch")}
          />
          <p className="text-sm text-tomato10">{errors.poolId?.message}</p>
          <div className="max-h-52 overflow-y-scroll flex flex-col gap-y-2 my-4 scrollbar-thin scrollbar-thumb-slate12 scrollbar-track-blue2">
            {poolsDataList?.pools
              .filter((pool) => filterPoolInput({ poolSearch, pool }))
              ?.map((pool) => (
                <Button
                  key={pool.id}
                  type="button"
                  className="bg-transparent border-transparent"
                  onClick={() => {
                    resetField("poolId");
                    handleSubmitForm({
                      poolId: pool.id,
                      network: network || "1",
                    });
                  }}
                >
                  {pool.name}
                </Button>
              ))}
          </div>
        </>
      )}
    </form>
  );
}
