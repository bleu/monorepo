import { TypenameEnum } from "@balancer-pool-metadata/schema";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import { Button } from "#/components";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/Accordion";
import { Checkbox } from "#/components/Checkbox";
import { usePoolMetadata } from "#/contexts/PoolMetadataContext";
import { toSlug } from "#/utils/formatStringCase";

interface Itemplate {
  name: string;
  options: {
    name: string;
    type: (typeof TypenameEnum.enum)[keyof typeof TypenameEnum.enum];
  }[];
}

export const ATTRIBUTES_TEMPLATE: Itemplate[] = [
  {
    name: "Basic Data",
    options: [
      { name: "Name", type: "text" },
      { name: "Symbol", type: "text" },
      { name: "Creator", type: "text" },
      { name: "Date creation", type: "date" },
      { name: "Website", type: "url" },
    ],
  },
  {
    name: "Managed Pools",
    options: [
      { name: "Report", type: "text" },
      { name: "History", type: "text" },
      { name: "Changelog", type: "text" },
    ],
  },
  {
    name: "Boosted Pools",
    options: [
      { name: "Summary", type: "text" },
      { name: "Changelog", type: "text" },
      { name: "Risks", type: "text" },
    ],
  },
];

interface ICheckboxState {
  [key: string]: {
    [key: string]: boolean;
  };
}

interface PoolMetadataAttribute {
  typename: (typeof TypenameEnum.enum)[keyof typeof TypenameEnum.enum];
  key: string;
  description: null;
  value: null;
}

export function PredefinedMetadataModal({ close }: { close?: () => void }) {
  const [checkboxes, setCheckboxes] = useState<ICheckboxState>(
    ATTRIBUTES_TEMPLATE.reduce((state, attribute) => {
      const options = attribute.options.reduce(
        (opt, option) => ({
          ...opt,
          [option.name]: false,
        }),
        { selectAll: false }
      );
      return { ...state, [attribute.name]: options };
    }, {} as ICheckboxState)
  );

  const { handleAddMetadata, isKeyUnique } = usePoolMetadata();

  const handleCheckboxChange = (groupName: string, optionName: string) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = {
        ...prevCheckboxes,
        [groupName]: {
          ...prevCheckboxes[groupName],
          [optionName]: !prevCheckboxes[groupName][optionName],
        },
      };
      if (optionName === "selectAll") {
        Object.keys(updatedCheckboxes[groupName]).forEach((key) => {
          updatedCheckboxes[groupName][key] =
            updatedCheckboxes[groupName]["selectAll"];
        });
      } else if (!updatedCheckboxes[groupName][optionName]) {
        updatedCheckboxes[groupName].selectAll = false;
      }
      return updatedCheckboxes;
    });
  };

  const getSelectedAttributesAndTypes = (): PoolMetadataAttribute[] => {
    const selectedAttributes: PoolMetadataAttribute[] = [];
    for (const attribute of ATTRIBUTES_TEMPLATE) {
      for (const option of attribute.options) {
        const { name, type } = option;
        if (checkboxes[attribute.name][name]) {
          selectedAttributes.push({
            typename: type,
            key: toSlug(name),
            value: null,
            description: null,
          });
        }
      }
    }
    return selectedAttributes;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedAttributes = getSelectedAttributesAndTypes();
    selectedAttributes.map((item) => {
      if (isKeyUnique(item.key)) {
        handleAddMetadata(item);
      }
    });
    close?.();
  };

  return (
    <form onSubmit={onSubmit}>
      <Accordion.Root
        className="my-4 w-full"
        type="single"
        defaultValue="item-1"
        collapsible
      >
        {ATTRIBUTES_TEMPLATE.map((attribute) => (
          <AccordionItem value={attribute.name}>
            <AccordionTrigger>{attribute.name}</AccordionTrigger>
            <AccordionContent>
              <div className="my-0 flex items-center">
                <Checkbox
                  id={`select-all-${attribute.name}`}
                  checked={checkboxes[attribute.name].selectAll}
                  onChange={() =>
                    handleCheckboxChange(attribute.name, "selectAll")
                  }
                  label={
                    checkboxes[attribute.name].selectAll
                      ? "Uncheck all"
                      : "Check all"
                  }
                />
              </div>
              <div className="ml-2 flex flex-col">
                {attribute.options.map((option) => (
                  <div key={option.name} className="flex items-center">
                    <Checkbox
                      id={`${attribute.name}-${option.name}`}
                      checked={checkboxes[attribute.name][option.name]}
                      onChange={() =>
                        handleCheckboxChange(attribute.name, option.name)
                      }
                      label={option.name}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion.Root>

      <div className="flex w-full items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button
            type="button"
            className="border border-indigo-500 bg-gray-700 text-indigo-400 hover:bg-gray-600 focus-visible:outline-indigo-500"
          >
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          className="bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-indigo-400"
          type="submit"
          disabled={false}
        >
          Add attributes
        </Button>
      </div>
    </form>
  );
}
