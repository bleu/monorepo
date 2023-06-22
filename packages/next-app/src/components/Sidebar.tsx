"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import cn from "clsx";
import { createContext, useContext } from "react";

interface SidebarContextType {
  isFloating: boolean;
}

const SidebarContext = createContext({} as SidebarContextType);

function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "Child components of Sidebar cannot be rendered outside the Sidebar component!"
    );
  }

  return context;
}

export default function Sidebar({
  children,
  isFloating = false,
  padding = "py-5 px-4",
}: {
  children: React.ReactNode;
  padding?: string;
  isFloating?: boolean;
}) {
  return (
    <SidebarContext.Provider value={{ isFloating }}>
      <div
        className={cn("w-full max-w-full h-full", padding, {
          "bg-blue2": !isFloating,
        })}
      >
        <div className="h-full w-72 lg:w-80 max-w-sm items-start justify-start space-y-2">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function Header({
  children,
  name,
}: {
  children?: React.ReactNode;
  name: string;
}) {
  useSidebarContext();

  return (
    <div className="items-start justify-start space-y-2.5 self-stretch">
      <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-slate12">
        <span>{name}</span>
      </div>
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { isFloating } = useSidebarContext();

  return (
    <div
      className={cn("relative max-h-[38rem] self-stretch overflow-auto", {
        "rounded-md": isFloating,
      })}
    >
      {children}
    </div>
  );
}

function InputFilter({
  placeHolder,
  onChange,
}: {
  placeHolder: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  useSidebarContext();
  return (
    <div className="flex items-center">
      <input
        placeholder={placeHolder}
        className="h-9 w-full appearance-none items-center justify-center rounded-l-[4px] bg-white px-[10px] text-sm leading-none text-slate12 outline-none"
        onChange={onChange}
      />
      <button className="h-9 rounded-r-[4px] bg-blue4 px-2 leading-none outline-none transition hover:bg-blue4">
        <MagnifyingGlassIcon
          color="rgb(31 41 55)"
          className="ml-1 font-semibold"
          height={20}
          width={20}
        />
      </button>
    </div>
  );
}

function Item({
  children,
  isSelected = false,
}: {
  children: React.ReactNode;
  isSelected: boolean;
}) {
  const { isFloating } = useSidebarContext();
  return (
    <button
      className={cn(
        "group h-20 w-full self-stretch px-2 border border-blue6 hover:border-blue8 hover:bg-blue4",
        {
          "px-5": !isFloating,
          "rounded-md": isFloating,
          "bg-blue5": isSelected,
        }
      )}
    >
      <div className="flex w-full flex-col space-y-1">{children}</div>
    </button>
  );
}

Sidebar.Header = Header;
Sidebar.Content = Content;
Sidebar.InputFilter = InputFilter;
Sidebar.Item = Item;
