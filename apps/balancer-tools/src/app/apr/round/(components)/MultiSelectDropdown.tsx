"use client";

import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import React, { useCallback, useState } from "react";

import { Badge } from "#/components/Badge";
import { BaseInput } from "#/components/Input";

export const MultiSelectDropdown = ({
  items,
  placeholderText,
  onSelectionItemsChange,
  initialSelectedItems,
  ...rest
}: {
  items: string[];
  placeholderText: string;
  onSelectionItemsChange: (items: string[]) => void;
  initialSelectedItems: string[];
}) => {
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelectedItems);

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value.length) {
      if (event.key === "Backspace") {
        const copySelectedItems = [...selectedItems];
        copySelectedItems.pop();
        setSelectedItems(copySelectedItems);
        onSelectionItemsChange(copySelectedItems);
      }
    }
  }

  const changeHandler = useCallback(
    (
      selectedItems: string[],
      setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
      onSelectionItemsChange: (items: string[]) => void,
    ) => {
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
    },
    [selectedItems],
  );

  const removeSelectedItemByIndex = useCallback(
    (
      i: number,
      selectedItems: string[],
      setSelectedItems: (items: string[]) => void,
      onSelectionItemsChange: (items: string[]) => void,
    ) => {
      const temp = [...selectedItems];
      temp.splice(i, 1);
      setSelectedItems(temp);
      onSelectionItemsChange(temp);
    },
    [selectedItems],
  );

  const getFilteredItems = useCallback(
    (inputValue: string | null) => {
      return items.filter(
        (item) =>
          !selectedItems.find((selected) => selected === item) &&
          item.includes(String(inputValue)),
      );
    },
    [selectedItems],
  );

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
          highlightedIndex,
          isOpen,
          toggleMenu,
          inputValue,
        }) => {
          return (
            <div>
              <div className="relative mt-1">
                <div className="flex items-center bg-blue4 relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-within:ring-2 focus-within:ring-blue6 focus-within:ring-opacity/75 focus-within:ring-offset-2 focus-within:ring-offset-blue3 sm:text-sm">
                  <label {...getLabelProps()} className="flex-1 mx-1">
                    <MagnifyingGlassIcon />
                  </label>
                  <div className="flex gap-2">
                    {selectedItems.map((value, idx) => {
                      return (
                        <Badge key={value + idx} color="blue">
                          <div
                            className="flex gap-2 items-center w-max"
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
                            <span className="cursor-pointer">
                              <Cross1Icon />
                            </span>
                          </div>
                        </Badge>
                      );
                    })}
                  </div>

                  <BaseInput
                    placeholder={placeholderText}
                    {...getInputProps()}
                    onFocus={() => {
                      toggleMenu();
                    }}
                    onKeyDown={handleOnKeyDown}
                    className="hover:shadow-[0] focus:shadow-[0] shadow-[0]"
                  />
                </div>
              </div>

              {isOpen && (
                <div className="absolute z-50 my-2 flex max-h-52 flex-col overflow-y-scroll rounded border-[1px] border-blue6 bg-blue3 scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12 w-full">
                  {getFilteredItems(inputValue).length > 0 ? (
                    getFilteredItems(inputValue).map((item, idx) => {
                      return (
                        <div
                          className={`flex w-full flex-col items-start cursor-pointer p-2 ${
                            idx == highlightedIndex
                              ? "bg-blue6"
                              : "bg-transparent"
                          }`}
                          {...getItemProps({ item, key: item + idx })}
                        >
                          <span>{item}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center text-center text-slate12 p-4">
                      <span>Sorry, no token was found with the symbol</span>
                    </div>
                  )}
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
