"use client";

import { createContext, PropsWithChildren, useContext } from "react";

import { AnalysisData, usePoolSimulator } from "./PoolSimulatorContext";

interface PoolSimulatorContextType {
  data: AnalysisData;
  setData: (data: AnalysisData) => void;
  //   poolType: PoolType;
  //   setPoolType: (value: PoolType) => void;
  isCustomData: boolean;
}

export const FormContext = createContext({} as PoolSimulatorContextType);

export function InitialFormContextProvider({ children }: PropsWithChildren) {
  const { initialData, setInitialData } = usePoolSimulator();
  //   const setPoolType = (value: PoolType) => {
  //     setInitialData({ ...initialData, poolType: value });
  //   };
  //   const poolType = initialData.poolType;
  //   const [poolType, setPoolType] = useState<PoolType>(PoolTypeEnum.MetaStable);

  return (
    <FormContext.Provider
      value={{
        data: initialData,
        setData: setInitialData,
        // poolType,
        // setPoolType,
        isCustomData: false,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function CustomFormContextProvider({ children }: PropsWithChildren) {
  const { customData, setCustomData } = usePoolSimulator();
  //   const setPoolType = (value: PoolType) => {
  //     setCustomData({ ...customData, poolType: value });
  //   };
  //   const poolType = customData.poolType;
  //   const [poolType, setPoolType] = useState<PoolType>(PoolTypeEnum.MetaStable);

  return (
    <FormContext.Provider
      value={{
        data: customData,
        setData: setCustomData,
        // poolType,
        // setPoolType,
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
