"use client";

import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { pools } from "#/lib/gql";
import { truncateAddress } from "#/utils/truncate";

import { Form, FormField, FormLabel } from "../ui/form";
import filterPoolInput from "./filterPoolInput";

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
  defaultValueNetwork = "1",
  defaultValuePool,
  form = useForm<PoolAttribute>(),
  children,
}: {
  onSubmit?: (formData: PoolAttribute) => void;
  close?: () => void;
  poolTypeFilter?: string[];
  showPools?: boolean;
  defaultValueNetwork?: string;
  defaultValuePool?: string;
  form?: UseFormReturn<PoolAttribute>;
  children?: ReactNode | undefined;
}) {
  const [comboBoxIsOpen, setComboBoxIsOpen] = useState(false);
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
    closeCombobox();
  }

  const filteredPoolList = poolsDataList?.pools.filter((pool) =>
    filterPoolInput({ poolSearchQuery: poolId, pool }),
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
  }, [poolsData, poolId, setError, clearErrors]);

  useLayoutEffect(() => {
    poolsDataListMutate();
    resetField("poolId");
  }, [network, poolsDataListMutate, resetField]);

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
            defaultValue={defaultValueNetwork}
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
            defaultValue={defaultValuePool}
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
          {comboBoxIsOpen && filteredPoolList && (
            <div className="absolute z-50 my-2 flex max-h-52 flex-col gap-y-2 overflow-y-scroll rounded border-[1px] border-blue6 bg-blue3 scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12 w-full">
              <div className="p-2">
                {filteredPoolList?.length > 0 ? (
                  filteredPoolList?.map((pool) => (
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
                        <span>
                          {/* By default, FX pools have the name equal to "BPT".
                            So, we'll use name instead of the symbol, since it is more meaningful */}
                          {poolTypeFilter?.[0] == "FX" &&
                          poolTypeFilter?.length == 1
                            ? pool.name
                            : pool.symbol}
                        </span>
                        <div className="flex w-full items-center gap-x-1 text-xs text-slate9">
                          <span>{truncateAddress(pool.id)}</span>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-center text-slate12">
                      Sorry, no pools were found 😓
                    </span>
                    <span className="text-center text-slate9 text-sm">
                      Please try another network
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {children}

        <div className="mt-4 flex items-center justify-end">
          <Button type="submit" disabled={!isPool || poolId === ""}>
            Go
          </Button>
        </div>
      </div>
    </Form>
  );
}
