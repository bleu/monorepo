"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";
import { HTMLProps } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "#/components/Button";
import { Select, SelectItem } from "#/components/Select";
import { ActionAttribute } from "#/contexts/AdminToolsContext";

const Input = React.forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  ({ label, ...rest }: React.HTMLProps<HTMLInputElement>, ref) => {
    return (
      <div className="mb-4">
        <label className="mb-2 block text-sm text-gray-400">{label}</label>
        <input
          ref={ref}
          {...rest}
          className="selection:color-white bg-blackA5 shadow-blackA9 selection:bg-blackA9 disabled:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
        />
      </div>
    );
  }
);

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
  data?: ActionAttribute;
  mode?: "add" | "edit";
  close?: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    control,
    formState: { errors },
  } = useForm<ActionAttribute>({
    defaultValues: {
      ...data,
      typename: data?.typename || "text",
    },
  });

  function handleSubmitForm() {
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
