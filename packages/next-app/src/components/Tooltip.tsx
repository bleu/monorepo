"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import React, { ReactElement } from "react";

type TooptipProps = {
  children: ReactElement;
  content: string;
  open: boolean;
};

export function Tooltip({ children, content, open, ...props }: TooptipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root disableHoverableContent>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        {open && (
          <TooltipPrimitive.Content
            className="select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade"
            sideOffset={0}
            side="bottom"
            align="center"
            {...props}
          >
            {content}
            <TooltipPrimitive.Arrow width={11} height={5} />
          </TooltipPrimitive.Content>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
