import React from "react";

import * as Select from "#/components/Select";

const SelectInput = ({
  label,
  name,
  options,
  onValueChange,
  placeholder,
}: {
  label?: string;
  name: string;
  options: { id: number | string; value: string }[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="flex w-full flex-col justify-start">
    <label className="block text-sm" htmlFor={name}>
      {label}
      <Select.SelectRoot onValueChange={onValueChange} name={name}>
        <Select.SelectTrigger className="h-[35px] inline-flex w-full items-center gap-[5px] bg-input hover:bg-input/20 hover:text-accent-foreground text-black border border-border">
          <Select.SelectValue placeholder={placeholder} />
        </Select.SelectTrigger>
        <Select.SelectContent className="z-[10000] w-full overflow-hidden bg-input rounded-lg">
          <Select.SelectGroup>
            <Select.SelectLabel className="pl-4" />
            {options.map((option) => (
              <Select.SelectItem
                key={option.id}
                value={option.id.toString()}
                className="relative flex select-none items-center bg-input leading-none data-[highlighted]:bg-accent data-[highlighted]:font-semibold data-[disabled]:text-gray-400 data-[highlighted]:outline-none border-none"
              >
                {option.value}
              </Select.SelectItem>
            ))}
          </Select.SelectGroup>
        </Select.SelectContent>
      </Select.SelectRoot>
    </label>
  </div>
);

export { SelectInput };
