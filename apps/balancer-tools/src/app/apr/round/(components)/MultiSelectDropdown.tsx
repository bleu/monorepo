"use client";

import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import React, { useState } from "react";

export const MultiSelectDropdown = ({
  items,
  labelText,
  onSelectionItemsChange,
  initialSelectedItems,
  ...rest
}: {
  items: string[];
  labelText: string;
  onSelectionItemsChange: (items: string[]) => void;
  initialSelectedItems: string[];
}) => {
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelectedItems);

  return (
    <div className="relative">
      <Downshift
        {...rest}
        onChange={changeHandler(
          selectedItems,
          setSelectedItems,
          onSelectionItemsChange,
        )}
      >
        {({
          getLabelProps,
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
        }) => {
          return (
            <div>
              <div className="relative mt-1">
                <div className="flex items-center relative w-full cursor-default overflow-hidden rounded-lg bg-blue6 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <label {...getLabelProps()} className="flex-1 mx-1">
                    <MagnifyingGlassIcon />
                  </label>
                  {selectedItems.map((value, idx) => {
                    return (
                      <button
                        key={value + idx}
                        className="relative mx-1 flex gap-2 h-fit items-center rounded-md px-2 py-1 bg-blue7 whitespace-nowrap"
                        onClick={() =>
                          removeSelectedItemByIndex(
                            idx,
                            selectedItems,
                            setSelectedItems,
                            onSelectionItemsChange,
                          )
                        }
                      >
                        <span>{value}</span>
                        <span>
                          <Cross1Icon />
                        </span>
                      </button>
                    );
                  })}

                  <input
                    placeholder={labelText}
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 bg-transparent text-white"
                    {...getInputProps()}
                    type="text"
                  />
                </div>
              </div>

              {isOpen && (
                <div className="absolute z-50 my-2 flex max-h-52 flex-col gap-y-2 overflow-y-scroll rounded border-[1px] border-blue6 bg-blue3 scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12 w-full">
                  <div className="p-2">
                    {items.filter(
                      (item) =>
                        !selectedItems.find((selected) => selected === item) &&
                        item.includes(String(inputValue)),
                    ).length > 0 ? (
                      items
                        .filter(
                          (item) =>
                            !selectedItems.find(
                              (selected) => selected === item,
                            ) && item.includes(String(inputValue)),
                        )
                        .map((item, idx) => {
                          return (
                            <div
                              className="flex w-full flex-col items-start cursor-pointer"
                              {...getItemProps({ item, key: item + idx })}
                            >
                              <div>
                                <span>{item}</span>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-center text-slate12">
                          Sorry, nothing was found 😓
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div></div>
            </div>
          );
        }}
      </Downshift>
    </div>
  );
};

/* Helper functions */
function changeHandler(
  selectedItems: string[],
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
  onSelectionItemsChange: (items: string[]) => void,
) {
  return (
    selectedItem: string | null,
    downshift: ControllerStateAndHelpers<string>,
  ) => {
    if (!selectedItem) return;
    const i = selectedItems.findIndex((item) => item === selectedItem);
    if (i === -1) setSelectedItems([...selectedItems, selectedItem]);
    onSelectionItemsChange([...selectedItems, selectedItem]);
    downshift.clearSelection();
  };
}

function removeSelectedItemByIndex(
  i: number,
  selectedItems: string[],
  setSelectedItems: (items: string[]) => void,
  onSelectionItemsChange: (items: string[]) => void,
) {
  const temp = [...selectedItems];
  temp.splice(i, 1);
  setSelectedItems(temp);
  onSelectionItemsChange(temp);
}
