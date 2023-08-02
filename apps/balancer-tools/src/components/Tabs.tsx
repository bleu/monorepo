import * as TabsPrimitive from "@radix-ui/react-tabs";
import cn from "clsx";
import { createContext, useContext, useEffect, useState } from "react";

type TabContextType<T> = {
  value: T;
  setValue: (value: T) => void;
};

const TabContext = createContext<TabContextType<any> | undefined>(undefined);

export function useTabContext<T>() {
  const context = useContext<TabContextType<T> | undefined>(TabContext);

  if (!context) {
    throw new Error(
      "Child components of Tab cannot be rendered outside the Tab component!",
    );
  }

  return context;
}

type TabsProps<T> = React.PropsWithChildren<{
  defaultValue: T;
  value?: T;
  onChange?: (value: T) => void;
}>;

export function Tabs<T extends string | undefined>({
  children,
  defaultValue,
  value: propValue,
  onChange,
}: TabsProps<T>) {
  const [value, setValue] = useState(propValue || defaultValue);

  const handleChange = (newValue: T) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (propValue !== undefined) {
      setValue(propValue);
    }
  }, [propValue]);

  return (
    <TabContext.Provider
      value={{
        value,
        setValue: handleChange,
      }}
    >
      <TabsPrimitive.Root
        className="flex h-full w-full flex-col bg-blue2 text-slate8"
        value={value}
        defaultValue={defaultValue}
      >
        <TabsPrimitive.List className="flex shrink-0 flex-col border-b border-blue1 bg-blue3">
          {children}
        </TabsPrimitive.List>
      </TabsPrimitive.Root>
    </TabContext.Provider>
  );
}

function TabItemTriggerWrapper({ children }: React.PropsWithChildren) {
  return <div className="flex flex-1">{children}</div>;
}

function TabItemTrigger({
  children,
  tabName,
  color,
  onClick,
}: React.PropsWithChildren<{
  tabName: string;
  color?: string;
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void;
}>) {
  const { setValue } = useTabContext();
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] hover:text-white hover:bg-blue4 data-[state=active]:text-white outline-none cursor-defaul} data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]",
      )}
      value={tabName}
      onClick={(e) => {
        onClick?.(e);
        setValue(tabName);
      }}
    >
      <div className="flex items-center justify-center gap-x-3">
        {color && <div className={cn(`w-3 h-3 rounded-full bg-${color}`)} />}
        {children}
      </div>
    </TabsPrimitive.Trigger>
  );
}

function TabItemContent({
  children,
  tabName,
  bgColor = "bg-blue2",
}: React.PropsWithChildren<{ tabName: string; bgColor?: `bg-${string}` }>) {
  useTabContext();
  return (
    <TabsPrimitive.Content
      className={`${bgColor} grow py-5 outline-none`}
      value={tabName}
    >
      {children}
    </TabsPrimitive.Content>
  );
}

Tabs.ItemTriggerWrapper = TabItemTriggerWrapper;
Tabs.ItemTrigger = TabItemTrigger;
Tabs.ItemContent = TabItemContent;
