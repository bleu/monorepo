"use client";

import { Address } from "@bleu-balancer-tools/shared";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { Chain } from "#/wagmi";

type ValidationFunctions = "poolExists" | "gaugeExists";

// TODO: generate TS types from zod: https://github.com/sachinraja/zod-to-ts
export interface ActionAttribute {
  id: number;
  name: string;
  description: string;
  operationResponsible: string;
  contractAddress: Address;
  contractUrl: string;
  fields: {
    label: string;
    key: string;
    placeholder: string;
    getValidations?: (chain?: Chain) => {
      [key in ValidationFunctions]?: (value: string) => Promise<string>;
    };
  }[];
}

//TODO fetch selectedAction data from action Id once the backend exists #BAL-157
export const initialState: ActionAttribute = {
  id: 0,
  name: "",
  description: "",
  operationResponsible: "",
  contractAddress: "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B",
  contractUrl: "",
  fields: [
    {
      label: "",
      key: "",
      placeholder: "",
    },
  ],
};

interface AdminToolsContextType {
  //#BAL-157 selectedAction is an Id
  selectedAction: ActionAttribute | null;
  handleSetAction: (action: ActionAttribute) => void;
  submit: boolean;
  handleSubmit: Dispatch<SetStateAction<boolean>>;
}

export const AdminToolsContext = createContext({} as AdminToolsContextType);

export function AdminToolsProvider({ children }: { children: ReactNode }) {
  const [selectedAction, setSelectedAction] =
    useState<ActionAttribute>(initialState);

  const [submit, handleSubmit] = useState<boolean>(false);

  function handleSetAction(action: ActionAttribute) {
    setSelectedAction(action);
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
      <div className="grow">{children}</div>
    </AdminToolsContext.Provider>
  );
}

export function useAdminTools() {
  const context = useContext(AdminToolsContext);

  return context;
}
