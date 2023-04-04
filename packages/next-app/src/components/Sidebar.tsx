"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
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
}: {
  children: React.ReactNode;
  isFloating?: boolean;
}) {
  return (
    <SidebarContext.Provider value={{ isFloating }}>
      <div
        className={classNames(
          "w-full max-w-full  py-5",
          isFloating ? "bg-gray-900" : "bg-gray-800"
        )}
      >
        <div className="h-screen w-96 max-w-full items-start justify-start space-y-4">
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
    <div className="items-start justify-start space-y-2.5 self-stretch px-5">
      <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
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
      className={classNames(
        "relative max-h-[40rem] self-stretch overflow-auto",
        isFloating ? "rounded-md border border-gray-700 bg-gray-800 mx-5" : ""
      )}
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
        className="h-9 w-full appearance-none items-center justify-center rounded-l-[4px] bg-white px-[10px] text-sm leading-none text-gray-400 outline-none"
        onChange={onChange}
      />
      <button className="h-9 rounded-r-[4px] bg-gray-400 px-2 leading-none outline-none transition hover:bg-gray-500">
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
      className={classNames(
        "group h-20 w-full self-stretch px-1 hover:bg-gray-700",
        isSelected ? "bg-gray-700" : "bg-gray-800",
        !isFloating ? "px-5" : ""
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
