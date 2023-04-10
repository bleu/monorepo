"use client";

import React, { HTMLProps } from "react";

interface IInput extends HTMLProps<HTMLInputElement> {
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, IInput>(
  ({ label, errorMessage, ...rest }: IInput, ref) => {
    return (
      <div className="mb-4">
        <label className="mb-2 block text-sm text-slate12">{label}</label>
        <input
          ref={ref}
          {...rest}
          className="selection:color-white box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
        />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    );
  }
);
