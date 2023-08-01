"use client";

import { createContext, PropsWithChildren, useContext } from "react";

import { AnalysisData, usePoolSimulator } from "./PoolSimulatorContext";

interface PoolSimulatorContextType {
  data: AnalysisData;
  setData: (data: AnalysisData) => void;
  isCustomData: boolean;
}

export const PoolSimulatorFormContext = createContext(
  {} as PoolSimulatorContextType
);

export function InitialFormContextProvider({ children }: PropsWithChildren) {
  const { initialData, setInitialData } = usePoolSimulator();

  return (
    <PoolSimulatorFormContext.Provider
      value={{
        data: initialData,
        setData: setInitialData,
        isCustomData: false,
      }}
    >
      {children}
    </PoolSimulatorFormContext.Provider>
  );
}

export function CustomFormContextProvider({ children }: PropsWithChildren) {
  const { customData, setCustomData } = usePoolSimulator();

  return (
    <PoolSimulatorFormContext.Provider
      value={{
        data: customData,
        setData: setCustomData,
        isCustomData: true,
      }}
    >
      {children}
    </PoolSimulatorFormContext.Provider>
  );
}

export function usePoolFormContext() {
  const context = useContext(PoolSimulatorFormContext);
  return context;
}
