"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import cn from "classnames";
import cuid from "cuid";
import * as React from "react";
import { HTMLProps, useContext, useState } from "react";
import { useForm } from "react-hook-form";

import {
  PoolMetadataAttribute,
  PoolMetadataContext,
} from "../contexts/PoolMetadataContext";
import { Button } from "./Button";

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

const inputTypes = [
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
  const [attributeType, setAttributeType] = useState("text");
  const { register, handleSubmit, reset } = useForm<PoolMetadataAttribute>();
  const { handleAddMetadata, handleUpdateMetadata } =
    useContext(PoolMetadataContext);

  function handleSubmitForm(formData: PoolMetadataAttribute) {
    switch (mode) {
      case "add":
        handleAddMetadata({ ...formData });
        reset();
        return;
      case "edit":
        handleUpdateMetadata({ ...formData });
        reset();
        return;
      default:
        handleAddMetadata({ ...formData });
        reset();
        return;
    }
  }

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
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              id="attribute-form"
              className="px-2 pt-2"
            >
              <input hidden value={data?.id || cuid()}></input>
              <label className="mb-2 block text-sm text-gray-400">Type</label>
              <div className="mb-4">
                <select
                  placeholder="Choose a type"
                  className="w-full rounded border p-2 leading-tight text-gray-400 shadow focus:outline-none"
                  {...register("type")}
                  defaultValue={data?.type as string}
                  onChange={(e) => {
                    setAttributeType(e.target.value);
                  }}
                >
                  {inputTypes.map(({ value, label }) => (
                    <option value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Name"
                placeholder={data?.name || "Define an attribute name"}
                {...register("name")}
                defaultValue={data?.name}
              />
              <Input
                label="Description"
                placeholder={data?.desc || "Short attribute description"}
                {...register("desc")}
                defaultValue={data?.desc}
              />
              <Input
                type={attributeType}
                label="Value"
                placeholder="Attribute value"
                {...register("value")}
                defaultValue={data?.value as string}
              />
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
