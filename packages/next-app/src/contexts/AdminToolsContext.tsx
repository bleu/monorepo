"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export function toSlug(string?: string) {
  return (
    string
      ?.toLowerCase()
      ?.replace(/ /g, "-")
      ?.replace(/[^\w-]+/g, "") || ""
  );
}

// TODO: generate TS types from zod: https://github.com/sachinraja/zod-to-ts
export interface ActionAttribute {
  typename: any;
  key: string;
  description: string;
  value: string;
}

interface AdminToolsContextType {
  selectedAction: string | null;
  handleSetAction: (actionId: string) => void;
  submit: boolean;
  handleSubmit: Dispatch<SetStateAction<boolean>>;
}

export const AdminToolsContext = createContext({} as AdminToolsContextType);

export function AdminToolsProvider({ children }: { children: ReactNode }) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [submit, handleSubmit] = useState<boolean>(false);

  function handleSetAction(actionId: string) {
    setSelectedAction(actionId);
  }

  return (
    <AdminToolsContext.Provider
      value={{
        selectedAction,
        handleSetAction,
        submit,
        handleSubmit,
      }}
    >
      {children}
    </AdminToolsContext.Provider>
  );
}
