import * as ToastPrimitive from "@radix-ui/react-toast";
import cn from "clsx";
import React, { Dispatch } from "react";

import { ProgressBar } from "./ProgressBar";

interface IToast {
  content: React.ReactElement;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  duration?: number;
  variant?: "notification" | "pending" | "alert" | "success";
}

export function Toast({
  content,
  isOpen,
  setIsOpen,
  duration = 30000,
  variant = "notification",
}: IToast) {
  let bgColor;
  switch (variant) {
    case "notification":
      bgColor = "bg-blue1";
      break;
    case "pending":
      bgColor = "bg-amber1";
      break;
    case "alert":
      bgColor = "bg-tomato1";
      break;
    case "success":
      bgColor = "bg-green1";
      break;
  }

  return (
    <>
      <ToastPrimitive.Root
        duration={duration}
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          "data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut mb-2 grid grid-cols-[auto_max-content] items-center shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
          bgColor
        )}
      >
        <div className="relative w-full">
          <div className="absolute w-full">
            <ProgressBar variant={variant} />
          </div>
          {React.cloneElement(React.Children.only(content), {
            close: () => setIsOpen(false),
          })}
        </div>
      </ToastPrimitive.Root>
    </>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[350px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </ToastPrimitive.Provider>
  );
}
