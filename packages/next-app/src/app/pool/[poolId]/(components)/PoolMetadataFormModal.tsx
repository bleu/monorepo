"use client";

import { MetadataItemSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import cn from "classnames";
import * as React from "react";
import { HTMLProps, useContext } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "#/components/Button";
import { Select, SelectItem } from "#/components/Select";
import {
  PoolMetadataAttribute,
  PoolMetadataContext,
} from "#/contexts/PoolMetadataContext";

const Input = React.forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  ({ label, ...rest }: React.HTMLProps<HTMLInputElement>, ref) => {
    return (
      <div className="mb-4">
        <label className="mb-2 block text-sm text-gray-400">{label}</label>
        <input
          ref={ref}
          {...rest}
          className="block w-full rounded border bg-gray-50 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
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

export function PoolMetadataFormModal({
  children: trigger,
  mode,
  data,
}: {
  children: React.ReactNode;
  mode: "add" | "edit";
  data?: PoolMetadataAttribute;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0"
          )}
        />
        <Dialog.Content
          className={cn(
            "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          )}
        >
          <Dialog.Title asChild>
            <h1 className="mx-1 text-2xl font-medium text-gray-400">
              {mode === "add" ? "Add new attribute" : "Edit attribute"}
            </h1>
          </Dialog.Title>
          <div className="w-full">
            <Form data={data} mode={mode} />
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[30px] w-[30px] items-center justify-center text-gray-200 hover:font-black	focus:shadow-[0_0_0_2px] focus:shadow-gray-200 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Form({
  data,
  mode,
}: {
  data?: PoolMetadataAttribute;
  mode: "add" | "edit";
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    setError,
    control,
    formState: { errors },
  } = useForm<PoolMetadataAttribute>({
    resolver: zodResolver(MetadataItemSchema),
    defaultValues: {
      typename: data?.typename || "text",
    },
  });
  const { handleAddMetadata, handleUpdateMetadata, isKeyUnique } =
    useContext(PoolMetadataContext);

  function handleSubmitForm(formData: PoolMetadataAttribute) {
    const uniqueKey = isKeyUnique(formData.key);

    if (!uniqueKey) {
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

    // WHY?
    switch (mode) {
      case "add":
        handleAddMetadata(formData);
        reset();
        return;
      case "edit":
        handleUpdateMetadata(formData);
        reset();
        return;
      default:
        handleAddMetadata(formData);
        reset();
        return;
    }
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
      <div className="mb-4">
        <Controller
          control={control}
          name={"typename"}
          defaultValue={data?.typename || "text"}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              onValueChange={onChange}
              value={value}
              ref={ref}
              defaultValue={data?.typename || "text"}
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
        placeholder={data?.key || "Define an attribute key"}
        {...register("key")}
      />
      <p>{errors.key?.message}</p>

      <Input
        label="Description"
        placeholder={data?.description || "Short attribute description"}
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
