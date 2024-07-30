"use client";

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
      "w-full selection:color-white border border-border box-border inline-flex h-[35px] appearance-none items-center justify-center bg-input px-[10px] text-[15px] leading-none text-border outline-none selection:bg-primary-content disabled:bg-brown9 ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 rounded-lg",
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
        <div className="flex flex-row gap-x-2 items-center mb-2">
          <FormLabel className="block text-sm text-background">
            {label}
          </FormLabel>
          {tooltipText && (
            <Tooltip content={tooltipText}>
              {tooltipLink ? (
                <a href={tooltipLink} target="_blank" rel="noopener noreferrer">
                  <InfoCircledIcon className="text-secondary-foreground" />
                </a>
              ) : (
                <InfoCircledIcon className="text-secondary-foreground" />
              )}
            </Tooltip>
          )}
        </div>
        <FormControl>
          <BaseInput
            {...props}
            {...register(name, validation)}
            className={cn({ "border border-destructive": errors[name] })}
          />
        </FormControl>
        {errorMessage && (
          <FormMessage className="mt-1 text-sm text-destructive">
            <span>{errorMessage}</span>
          </FormMessage>
        )}
      </div>
    );
  },
);
