"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { pools } from "#/lib/gql";

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

export default function SearchPoolForm({
  close,
  poolTypeFilter,
  onSubmit,
}: {
  close?: () => void;
  poolTypeFilter?: string[];
  onSubmit?: (formData: PoolAttribute) => void;
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
  } = useForm<PoolAttribute>();

  const poolId = watch("poolId");
  const network = watch("network");

  const gqlVariables = poolTypeFilter?.length
    ? { poolId, poolTypes: poolTypeFilter }
    : { poolId };
  const { data: poolData } = pools
    .gql(network || "1")
    .usePoolsWherePoolTypeInAndId(gqlVariables, { revalidateIfStale: true });

  const isPool = !!poolData?.pools?.length;

  function handleSubmitForm(formData: PoolAttribute) {
    onSubmit?.(formData);
    close?.();
  }

  React.useEffect(() => {
    if (poolData && !poolData.pools && poolId) {
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
  }, [poolData]);

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
                <SelectItem value={value}>{label}</SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

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
    </form>
  );
}
