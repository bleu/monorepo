import * as Accordion from "@radix-ui/react-accordion";
import {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import classNames from "clsx";
import { forwardRef } from "react";

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={classNames(
        "text-white group flex h-8 flex-1 cursor-default items-center justify-between px-1 text-[15px] leading-none shadow-[0_0px_0]",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className="text-white transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames(
      "data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]",
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="px-3">{children}</div>
  </Accordion.Content>
));
