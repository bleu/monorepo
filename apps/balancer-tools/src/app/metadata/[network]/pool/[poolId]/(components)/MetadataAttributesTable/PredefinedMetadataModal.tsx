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
import { TypenameEnum } from "#/lib/schema";
import { toSlug } from "#/utils/formatStringCase";

interface ITemplate {
  name: string;
  options: {
    key: string;
    typename: (typeof TypenameEnum.enum)[keyof typeof TypenameEnum.enum];
  }[];
}

export const ATTRIBUTES_TEMPLATE: ITemplate[] = [
  {
    name: "Basic Data",
    options: [
      { key: "Name", typename: "text" },
      { key: "Symbol", typename: "text" },
      { key: "Creator", typename: "text" },
      { key: "Date creation", typename: "date" },
      { key: "Website", typename: "url" },
    ],
  },
  {
    name: "Managed Pools",
    options: [
      { key: "Report", typename: "text" },
      { key: "History", typename: "text" },
      { key: "Changelog", typename: "text" },
    ],
  },
  {
    name: "Boosted Pools",
    options: [
      { key: "Summary", typename: "text" },
      { key: "Changelog", typename: "text" },
      { key: "Risks", typename: "text" },
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
          [option.key]: false,
        }),
        { selectAll: false },
      );
      return { ...state, [attribute.name]: options };
    }, {} as ICheckboxState),
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
        const { key, typename } = option;
        if (checkboxes[attribute.name][key]) {
          selectedAttributes.push({
            typename,
            key: toSlug(key),
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
      <Accordion.Root className="my-4 w-full" type="single" collapsible>
        {ATTRIBUTES_TEMPLATE.map(({ name, options }) => (
          <AccordionItem value={name}>
            <AccordionTrigger>{name}</AccordionTrigger>
            <AccordionContent>
              <div className="my-0 flex items-center">
                <Checkbox
                  id={`select-all-${name}`}
                  checked={checkboxes[name].selectAll}
                  onChange={() => handleCheckboxChange(name, "selectAll")}
                  label={
                    checkboxes[name].selectAll ? "Uncheck all" : "Check all"
                  }
                />
              </div>
              <div className="ml-2 flex flex-col">
                {options.map((option) => (
                  <div key={option.key} className="flex items-center">
                    <Checkbox
                      id={`${name}-${option.key}`}
                      checked={checkboxes[name][option.key]}
                      onChange={() => handleCheckboxChange(name, option.key)}
                      label={option.key}
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
          <Button shade="light" variant="outline">
            Cancel
          </Button>
        </Dialog.Close>
        <Button shade="light" type="submit">
          Add attributes
        </Button>
      </div>
    </form>
  );
}
