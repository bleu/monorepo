"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
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

export function toCammelCase(string: string) {
  return string
    .replace(/\s(.)/g, function ($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase();
    });
}

// TODO: generate TS types from zod: https://github.com/sachinraja/zod-to-ts
export interface ActionAttribute {
  id: number;
  name: string;
  description: string;
  operationResponsible: string;
  contractAddress: `0x${string}`;
  contractUrl: string;
  fields: {
    name: string;
    placeholder: string;
    type: string;
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
      name: "",
      placeholder: "",
      type: "",
    },
  ],
};

interface AdminToolsContextType {
  //#BAL-157 selectedAction is an Id
  selectedAction: ActionAttribute | null;
  handleSetAction: (action: ActionAttribute) => void;
  submit: boolean;
  handleSubmit: Dispatch<SetStateAction<boolean>>;
  selectedFilters: { [key: string]: string };
  changeSelectedFilters: (key: string, value: string) => void;
  clearSelectedFilter: (field: string) => void;
}

export const AdminToolsContext = createContext({} as AdminToolsContextType);

export function AdminToolsProvider({ children }: { children: ReactNode }) {
  const filterInitialState = {
    operationResponsible: "",
  };

  const [selectedAction, setSelectedAction] =
    useState<ActionAttribute>(initialState);

  const [submit, handleSubmit] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] = useState(filterInitialState);

  function changeSelectedFilters(key: string, value: string) {
    setSelectedFilters((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  }

  function clearSelectedFilter(field: string) {
    setSelectedFilters((prevState) => {
      return {
        ...prevState,
        [field]: "",
      };
    });
  }

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
        selectedFilters,
        changeSelectedFilters,
        clearSelectedFilter,
      }}
    >
      {children}
    </AdminToolsContext.Provider>
  );
}

export function useAdminTools() {
  const context = useContext(AdminToolsContext);

  return context;
}
