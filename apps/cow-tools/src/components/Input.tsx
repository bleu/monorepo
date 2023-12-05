"use client";

import { slateDarkA } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import cn from "clsx";
import React, { HTMLProps } from "react";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import { Tooltip } from "./Tooltip";
import { FormControl, FormLabel, FormMessage } from "./ui/form";

interface IInput extends Omit<HTMLProps<HTMLInputElement>, "name"> {
  name: string;
  validation?: RegisterOptions;
  tooltipText?: string;
  tooltipLink?: string;
}

export const BaseInput = React.forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement>
>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className={cn(
      "w-full selection:color-white box-border inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1",
      props.className,
    )}
  />
));

export const Input = React.forwardRef<HTMLInputElement, IInput>(
  ({ name, label, validation, tooltipText, tooltipLink, ...props }: IInput) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    if (!name) {
      throw new Error("Input component requires a name prop");
    }

    const error = errors[name] as FieldError | undefined;
    const errorMessage = error?.message;

    return (
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <FormLabel className="mb-2 block text-sm text-slate12">
            {label}
          </FormLabel>
          {tooltipText && (
            <Tooltip content={tooltipText}>
              {tooltipLink ? (
                <a href={tooltipLink} target="_blank">
                  <InfoCircledIcon color={slateDarkA.slateA11} />
                </a>
              ) : (
                <InfoCircledIcon color={slateDarkA.slateA11} />
              )}
            </Tooltip>
          )}
        </div>
        <FormControl>
          <BaseInput
            {...props}
            {...register(name, validation)}
            className={cn({ "border border-red-500": errors[name] })}
          />
        </FormControl>
        {errorMessage && (
          <FormMessage className="mt-1 h-6 text-sm text-tomato10">
            <span>{errorMessage}</span>
          </FormMessage>
        )}
      </div>
    );
  },
);
