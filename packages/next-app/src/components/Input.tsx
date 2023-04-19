"use client";

import cn from "classnames";
import React, { HTMLProps } from "react";

interface IInput extends HTMLProps<HTMLInputElement> {
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, IInput>(
  ({ label, errorMessage, ...rest }: IInput, ref) => {
    return (
      <div className="mb-4 flex flex-col">
        <label className="mb-2 block text-sm text-slate12">{label}</label>
        <input
          ref={ref}
          {...rest}
          className={cn(
            "w-full selection:color-white box-border inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
          )}
        />
        <div className="h-6 mt-1 text-red-800">
          {errorMessage && <span>{errorMessage}</span>}
        </div>
      </div>
    );
  }
);
