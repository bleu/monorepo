"use client";

import { createContext, PropsWithChildren, useContext } from "react";

import { AnalysisData, usePoolSimulator } from "./PoolSimulatorContext";

interface PoolSimulatorContextType {
  data: AnalysisData;
  setData: (data: AnalysisData) => void;
  isCustomData: boolean;
}

export const FormContext = createContext({} as PoolSimulatorContextType);

export function InitialFormContextProvider({ children }: PropsWithChildren) {
  const { initialData, setInitialData } = usePoolSimulator();

  return (
    <FormContext.Provider
      value={{
        data: initialData,
        setData: setInitialData,
        isCustomData: false,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function CustomFormContextProvider({ children }: PropsWithChildren) {
  const { customData, setCustomData } = usePoolSimulator();

  return (
    <FormContext.Provider
      value={{
        data: customData,
        setData: setCustomData,
        isCustomData: true,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function usePoolFormContext() {
  const context = useContext(FormContext);
  return context;
}
