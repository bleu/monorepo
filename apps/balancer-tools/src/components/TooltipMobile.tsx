"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";

export function TooltipMobile({
  children,
  disableTooltip = false,
  content,
  open = false,
  defaultOpen,
  onOpenChange,
  ...props
}: Popover.PopoverProps &
  Popover.PopoverContentProps & {
    content: ReactNode;
    disableTooltip?: boolean;
  }) {
  if (disableTooltip) return <>{children}</>;
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(e) => {
        if (onOpenChange) onOpenChange(e);
        setIsOpen(!isOpen);
      }}
    >
      <Popover.Trigger asChild onMouseEnter={() => setIsOpen(!isOpen)}>
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="focus:outline-none max-w-xl select-none rounded-[4px] border border-blue6 bg-blue3 px-2 py-1 text-center text-sm text-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]"
          sideOffset={6}
          avoidCollisions
          side="top"
          {...props}
        >
          {content}
          <Popover.Arrow width={11} height={5} className="fill-blue3" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
