"use client";

import { Cross1Icon } from "@radix-ui/react-icons";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import React, { useState } from "react";

export const MultiSelectDropdown = ({
  items,
  labelText,
  onSelectionItemsChange,
  ...rest
}: {
  items: { id: number; value: string }[];
  labelText: string;
  onSelectionItemsChange: (items: { id: number; value: string }[]) => void;
}) => {
  const [selectedItems, setSelectedItems] = useState<
    { id: number; value: string }[]
  >([]);

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
                <label {...getLabelProps()}>{labelText}</label>
                <div className="flex items-center relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  {selectedItems.map((value, i) => {
                    return (
                      <button
                        key={value.id}
                        className="relative mx-1 flex gap-2 h-fit items-center rounded-md px-2 py-1 bg-blue6 whitespace-nowrap"
                        onClick={() =>
                          removeSelectedItemByIndex(
                            i,
                            selectedItems,
                            setSelectedItems,
                            onSelectionItemsChange,
                          )
                        }
                      >
                        <span>{value.value}</span>
                        <span>
                          <Cross1Icon />
                        </span>
                      </button>
                    );
                  })}

                  <input
                    placeholder={labelText}
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
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
                        !selectedItems.find(({ id }) => id === item.id) &&
                        item.value.includes(String(inputValue)),
                    ).length > 0 ? (
                      items
                        .filter(
                          (item) =>
                            !selectedItems.find(({ id }) => id === item.id) &&
                            item.value.includes(String(inputValue)),
                        )
                        .map((item) => {
                          return (
                            <div
                              className="flex w-full flex-col items-start cursor-pointer"
                              {...getItemProps({ item, key: item.id })}
                            >
                              <div>
                                <span>{item.value}</span>
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
  selectedItems: { id: number; value: string }[],
  setSelectedItems: React.Dispatch<
    React.SetStateAction<{ id: number; value: string }[]>
  >,
  onSelectionItemsChange: (items: { id: number; value: string }[]) => void,
) {
  return (
    selectedItem: { id: number; value: string } | null,
    downshift: ControllerStateAndHelpers<{ id: number; value: string }>,
  ) => {
    if (!selectedItem) return;
    const i = selectedItems.findIndex((item) => item.id === selectedItem.id);
    if (i === -1) setSelectedItems([...selectedItems, selectedItem]);
    onSelectionItemsChange([...selectedItems, selectedItem]);
    downshift.clearSelection();
  };
}

function removeSelectedItemByIndex(
  i: number,
  selectedItems: { id: number; value: string }[],
  setSelectedItems: (items: { id: number; value: string }[]) => void,
  onSelectionItemsChange: (items: { id: number; value: string }[]) => void,
) {
  const temp = [...selectedItems];
  temp.splice(i, 1);
  setSelectedItems(temp);
  onSelectionItemsChange(temp);
}
