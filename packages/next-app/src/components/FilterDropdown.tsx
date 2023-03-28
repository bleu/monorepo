"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, EraserIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { toCamelCase } from "#/utils/formatStringCase";

export interface IFilter {
  name: string;
  options: string[];
}

interface IDropdownRadioItem {
  filter: IFilter;
  changeSelectedFilters: (key: string, value: string) => void;
  clearSelectedFilter: (field: string) => void;
}

interface IFilterDropdown extends Omit<IDropdownRadioItem, "filter"> {
  filters: IFilter[];
}

function DropdownRadioItem({
  changeSelectedFilters,
  clearSelectedFilter,
  filter,
}: IDropdownRadioItem) {
  const [filterValue, setFilterValue] = useState("");

  function handleSelectFilter(value: string) {
    setFilterValue(value);
    changeSelectedFilters(toCamelCase(filter.name), value);
  }
  function handleClearFilter() {
    clearSelectedFilter(toCamelCase(filter.name));
    setFilterValue("");
  }

  return (
    <>
      <div className="flex gap-4 text-xs leading-[25px] text-gray-500">
        <DropdownMenu.Label>{filter.name}</DropdownMenu.Label>
        <button onClick={handleClearFilter}>
          <EraserIcon className="hover:text-gray-900" />
        </button>
      </div>
      <DropdownMenu.RadioGroup
        value={filterValue}
        onValueChange={handleSelectFilter}
        className="flex flex-col gap-y-1 text-gray-700"
      >
        {filter.options.map((option) => (
          <DropdownMenu.RadioItem
            asChild
            key={option}
            value={`${option}`}
            className="w-fit rounded p-1 text-sm font-bold text-gray-800 outline-none"
          >
            {filterValue !== option ? (
              <span className="hover:cursor-pointer hover:bg-gray-100">
                {option}
              </span>
            ) : (
              <DropdownMenu.ItemIndicator className="bg-yellow-100">
                {option}
              </DropdownMenu.ItemIndicator>
            )}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </>
  );
}

export function FilterDropdown({
  filters,
  changeSelectedFilters,
  clearSelectedFilter,
}: IFilterDropdown) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2 rounded-[4px] bg-white px-2 text-sm leading-none text-gray-400 outline-none"
          aria-label="Customise options"
        >
          <span>Filter by</span>
          <ChevronDownIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade rounded-md bg-white px-5 py-2 will-change-[opacity,transform]"
        >
          {filters.map((filter) => {
            return (
              <DropdownRadioItem
                key={filter.name}
                filter={filter}
                changeSelectedFilters={changeSelectedFilters}
                clearSelectedFilter={clearSelectedFilter}
              />
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
