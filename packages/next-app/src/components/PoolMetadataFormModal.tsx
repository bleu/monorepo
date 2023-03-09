"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import cn from "classnames";
import { useState } from "react";

import { Button } from "./Button";

function Input({ label, ...rest }: React.HTMLProps<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm text-gray-400">{label}</label>
      <input
        {...rest}
        className="block w-full rounded border bg-gray-50 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
    </div>
  );
}

const inputTypes = [
  { value: "text", label: "Text" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
  { value: "datetime-local", label: "Datetime" },
];

export function PoolMetadataFormModal({
  children: trigger,
}: {
  children: React.ReactNode;
}) {
  const [attributeType, setAttributeType] = useState("text");

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
              Add new attribute
            </h1>
          </Dialog.Title>
          <div className="w-full">
            <form className="px-2 pt-2">
              <label className="mb-2 block text-sm text-gray-400">Type</label>
              <div className="mb-4">
                <select
                  placeholder="Choose a type"
                  className="w-full rounded border p-2 leading-tight text-gray-400 shadow focus:outline-none"
                  onChange={(e) => {
                    setAttributeType(e.target.value);
                  }}
                >
                  {inputTypes.map(({ value, label }) => (
                    <option value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <Input label="Name" placeholder="Define an attribute name" />
              <Input
                label="Description"
                placeholder="Short attribute description"
              />
              <Input
                type={attributeType}
                label="Value"
                placeholder="Attribute value"
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
                  disabled={true}
                  className="bg-indigo-500 text-gray-500 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600"
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
