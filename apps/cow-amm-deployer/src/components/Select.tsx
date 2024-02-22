import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import cn from "clsx";
import { ComponentPropsWithRef, forwardRef } from "react";

type SelectProps = ComponentPropsWithRef<typeof SelectPrimitive.Root>;

interface ISelect extends SelectProps {
  theme?: "dark" | "light";
  className?: string;
  placeholder?: string;
}
type SelectItemProps = React.ComponentPropsWithRef<typeof SelectPrimitive.Item>;

interface ISelectItem extends SelectItemProps {
  theme?: "dark" | "light";
}
const baseDark =
  "bg-blue4 text-white data-[highlighted]:bg-blue6 data-[highlighted]:text-slate-12";
const baseLight =
  "bg-white text-slate12 data-[highlighted]:bg-blue5 data-[highlighted]:text-white";

export const Select = forwardRef<HTMLButtonElement, ISelect>(
  (
    { children, theme = "dark", className = "", placeholder = null, ...props },
    forwardedRef,
  ) => {
    const baseTheme = theme === "dark" ? baseDark : baseLight;
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          className={cn(
            "inline-flex h-[35px] outline-none items-center justify-between gap-[4px] rounded px-[8px] text-[13px] leading-none ",
            baseTheme,
            theme === "dark"
              ? "shadow-blue1/10 border-blue6 border hover:bg-blue4 focus:shadow-[0_0_0_2px] focus:shadow-blue1 disabled:bg-blackA9 shadow-[0_2px_10px]"
              : "",
            className,
          )}
          ref={forwardedRef}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className={baseTheme}>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "overflow-hidden rounded-md  shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]",
              baseTheme,
            )}
          >
            <SelectPrimitive.ScrollUpButton
              className={cn(
                "flex h-[25px] cursor-default items-center justify-center",
                baseTheme,
              )}
            >
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-[5px]">
              {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton
              className={cn(
                "flex h-[25px] cursor-default items-center justify-center",
                baseTheme,
              )}
            >
              <ChevronDownIcon />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

export const SelectItem = forwardRef<HTMLDivElement, ISelectItem>(
  ({ children, className, theme = "dark", ...props }, forwardedRef) => {
    const baseTheme = theme === "dark" ? baseDark : baseLight;
    return (
      <SelectPrimitive.Item
        className={cn(
          "data-[disabled]:text-blue3 relative flex h-[25px] select-none items-center rounded-[3px] pr-[35px] pl-[25px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
          baseTheme,
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  },
);
