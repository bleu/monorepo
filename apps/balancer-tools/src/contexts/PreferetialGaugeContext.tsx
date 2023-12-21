"use client";

import { PreferentialGaugeQuery } from "@bleu-fi/gql/src/balancer-gauges/__generated__/Ethereum";
import { createContext, ReactNode, useContext, useState } from "react";

import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export type PreferentialGaugeGql = ArrElement<
  GetDeepProp<PreferentialGaugeQuery, "pools">
>;

interface PreferentialGaugeContextType {
  submit: boolean;
}

export const PreferentialGaugeContext = createContext(
  {} as PreferentialGaugeContextType,
);

export function PreferentialGaugeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [submit, handleSubmit] = useState<boolean>(false);

  return (
    <PreferentialGaugeContext.Provider
      value={{
        submit,
      }}
    >
      <div className="grow">{children}</div>
    </PreferentialGaugeContext.Provider>
  );
}

export function usePreferentialGauge() {
  const context = useContext(PreferentialGaugeContext);

  return context;
}
