"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import cn from "classnames";
import * as React from "react";

export function Dialog({
  children,
  content,
  title,
}: React.PropsWithChildren<{
  content: React.ReactElement;
  title: string;
}>) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          id="dialog-overlay"
          className={cn(
            "bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          )}
        >
          <DialogPrimitive.Title asChild>
            <h1 className="mx-1 text-2xl font-medium text-gray-400">{title}</h1>
          </DialogPrimitive.Title>
          <div className="w-full">
            {React.cloneElement(React.Children.only(content), {
              close: () => setOpen(false),
            })}
          </div>
          <DialogPrimitive.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[30px] w-[30px] items-center justify-center text-gray-200 hover:font-black	focus:shadow-[0_0_0_2px] focus:shadow-gray-200 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
