"use client";

import { PreferentialGaugeQuery } from "@bleu-fi/gql/src/balancer-gauges/__generated__/Ethereum";
import { createContext, ReactNode, useContext } from "react";

import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export type PreferentialGaugeGql = ArrElement<
  GetDeepProp<PreferentialGaugeQuery, "pools">
>;

interface PreferentialGaugeContextType {}

export const PreferentialGaugeContext = createContext(
  {} as PreferentialGaugeContextType,
);

export function PreferentialGaugeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PreferentialGaugeContext.Provider value={{}}>
      <div className="grow">{children}</div>
    </PreferentialGaugeContext.Provider>
  );
}

export function usePreferentialGauge() {
  const context = useContext(PreferentialGaugeContext);

  return context;
}
