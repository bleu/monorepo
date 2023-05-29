import * as TabsPrimitive from "@radix-ui/react-tabs";
import cn from "classnames";
import { createContext, useContext } from "react";

enum Colors {
  BLUE = "blue7",
  AMBER = "amber9",
}

const TabContext = createContext({});

function useTabContext() {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error(
      "Child components of Tab cannot be rendered outside the Tab component!"
    );
  }

  return context;
}

export function Tabs({ children }: React.PropsWithChildren) {
  return (
    <TabContext.Provider value={{}}>
      <TabsPrimitive.Root
        className="flex flex-col w-full h-full shadow-[0_2px_10px] shadow-blue2 bg-blue2 text-slate8"
        defaultValue="variantData"
      >
        <TabsPrimitive.List className="shrink-0 flex border-b border-blue1 bg-blue3 flex-col">
          {children}
        </TabsPrimitive.List>
      </TabsPrimitive.Root>
    </TabContext.Provider>
  );
}

function TabItemTriggerWrapper({ children }: React.PropsWithChildren) {
  return <div className="flex-1 flex">{children}</div>;
}

function TabItemTrigger({
  children,
  tabName,
  color = "BLUE",
}: React.PropsWithChildren<{ tabName: string; color?: keyof typeof Colors }>) {
  useTabContext();

  return (
    <TabsPrimitive.Trigger
      className={cn(
        `px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] hover:text-white hover:bg-blue4 data-[state=active]:text-white data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] outline-none cursor-default data-[state=active]:shadow-${Colors[color]} data-[state=active]:focus:shadow:${Colors[color]}`
      )}
      value={tabName}
    >
      <div className="flex justify-center items-center gap-x-3">
        <div className={cn(`w-3 h-3 rounded-full bg-${Colors[color]}`)} />
        {children}
      </div>
    </TabsPrimitive.Trigger>
  );
}

function TabItemContent({
  children,
  tabName,
}: React.PropsWithChildren<{ tabName: string }>) {
  useTabContext();
  return (
    <TabsPrimitive.Content
      className="grow py-5 bg-blue2 outline-none"
      value={tabName}
    >
      {children}
    </TabsPrimitive.Content>
  );
}
Tabs.ItemTriggerWrapper = TabItemTriggerWrapper;
Tabs.ItemTrigger = TabItemTrigger;
Tabs.ItemContent = TabItemContent;
