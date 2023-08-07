"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Form } from "#/components/ui/form";
import {
  type PoolMetadataAttribute,
  usePoolMetadata,
} from "#/contexts/PoolMetadataContext";
import { MetadataItemSchema } from "#/lib/schema";

const inputTypenames = [
  { value: "text", label: "Text" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
  { value: "datetime-local", label: "Datetime" },
];

export default function PoolMetadataForm({
  data,
  mode = "add",
  close,
}: {
  data?: PoolMetadataAttribute;
  mode?: "add" | "edit";
  close?: () => void;
}) {
  const form = useForm<PoolMetadataAttribute>({
    resolver: zodResolver(MetadataItemSchema),
    defaultValues: {
      ...data,
      typename: data?.typename || "text",
    },
  });

  const { register, watch, resetField, setError, control } = form;

  const { handleAddMetadata, handleUpdateMetadata, isKeyUnique } =
    usePoolMetadata();

  function handleSubmitForm(formData: PoolMetadataAttribute) {
    const uniqueKey = isKeyUnique(formData.key);

    if (!uniqueKey && mode === "add") {
      setError(
        "key",
        {
          type: "uniqueness",
          message: "This key already exists.",
        },
        { shouldFocus: true },
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
  }, [resetField, selectedTypename]);

  return (
    <Form {...form} onSubmit={handleSubmitForm} id="attribute-form">
      <label className="mb-2 block text-sm text-slate12">Typename</label>
      <div className="mb-2">
        <Controller
          control={control}
          name="typename"
          defaultValue={data?.typename || "text"}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              onValueChange={onChange}
              value={value}
              ref={ref}
              disabled={mode === "edit"}
            >
              {inputTypenames.map(({ value, label }) => (
                <SelectItem key={`${label}-${value}`} value={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <Input
          label="Key"
          placeholder={"Define an attribute key"}
          disabled={mode === "edit"}
          {...register("key")}
        />

        <Input
          label="Description"
          placeholder={"Short attribute description"}
          {...register("description")}
        />

        <Input
          type={selectedTypename}
          label="Value"
          placeholder="Attribute value"
          {...register("value")}
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <Dialog.Close asChild>
          <Button shade="light" variant="outline">
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          form="attribute-form"
          type="submit"
          shade="light"
          disabled={false}
        >
          Add
        </Button>
      </div>
    </Form>
  );
}
