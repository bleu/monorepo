"use client";

import { MetadataItemSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import {
  PoolMetadataAttribute,
  PoolMetadataContext,
} from "#/contexts/PoolMetadataContext";

const inputTypenames = [
  { value: "text", label: "Text" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
  { value: "datetime-local", label: "Datetime" },
];

export function PoolMetadataItemForm({
  data,
  mode = "add",
  close,
}: {
  data?: PoolMetadataAttribute;
  mode?: "add" | "edit";
  close?: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    setError,
    control,
    formState: { errors },
  } = useForm<PoolMetadataAttribute>({
    resolver: zodResolver(MetadataItemSchema),
    defaultValues: {
      ...data,
      typename: data?.typename || "text",
    },
  });

  const { handleAddMetadata, handleUpdateMetadata, isKeyUnique } =
    useContext(PoolMetadataContext);

  function handleSubmitForm(formData: PoolMetadataAttribute) {
    const uniqueKey = isKeyUnique(formData.key);

    if (!uniqueKey && mode === "add") {
      setError(
        "key",
        {
          type: "uniqueness",
          message: "This key already exists.",
        },
        { shouldFocus: true }
      );
      return;
    }

    switch (mode) {
      case "add":
        handleAddMetadata(formData);
      case "edit":
        handleUpdateMetadata(formData);
    }

    close?.();
  }

  const selectedTypename = watch("typename");

  React.useLayoutEffect(() => {
    resetField("value");
  }, [selectedTypename]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      id="attribute-form"
      className="px-2 pt-2"
    >
      <label className="mb-2 block text-sm text-gray-400">Typename</label>
      <div className="mb-2">
        <Controller
          control={control}
          name={"typename"}
          defaultValue={data?.typename || "text"}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              onValueChange={onChange}
              value={value}
              ref={ref}
              disabled={mode === "edit"}
            >
              {inputTypenames.map(({ value, label }) => (
                <SelectItem value={value}>{label}</SelectItem>
              ))}
            </Select>
          )}
        />
      </div>
      <Input
        label="Key"
        placeholder={"Define an attribute key"}
        disabled={mode === "edit"}
        {...register("key")}
      />
      <p>{errors.key?.message}</p>

      <Input
        label="Description"
        placeholder={"Short attribute description"}
        {...register("description")}
      />
      <p>{errors.description?.message}</p>

      <Input
        type={selectedTypename}
        label="Value"
        placeholder="Attribute value"
        {...register("value")}
      />
      <p>{errors.value?.message}</p>

      <div className="flex items-center justify-end gap-3">
        <Dialog.Close asChild>
          <Button
            type="button"
            className="border border-indigo-500 bg-gray-700 text-indigo-400 hover:bg-gray-600 focus-visible:outline-indigo-500"
          >
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          form="attribute-form"
          type="submit"
          disabled={false}
          className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500"
        >
          Save item
        </Button>
      </div>
    </form>
  );
}
