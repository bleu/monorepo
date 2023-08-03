"use client";

import { useEffect } from "react";

import { Select, SelectItem } from "#/components/Select";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

export default function AnalysisPoolParamsForm() {
  const {
    initialData,
    setAnalysisTokenByIndex,
    analysisToken,
    setCurrentTabTokenByIndex,
  } = usePoolSimulator();

  useEffect(() => {
    setAnalysisTokenByIndex(0);
    setCurrentTabTokenByIndex(1);
  }, []);

  const indexCurrentTabToken = initialData?.tokens.findIndex(
    ({ symbol }) => symbol.toLowerCase() !== analysisToken.symbol.toLowerCase(),
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="mb-2 block text-sm text-slate12">
            Analysis Token
          </span>
          <Select
            onValueChange={(i) => {
              if (indexCurrentTabToken === Number(i)) {
                setCurrentTabTokenByIndex(
                  initialData?.tokens.findIndex(
                    (value, index) => index !== Number(i),
                  ),
                );
              }
              setAnalysisTokenByIndex(Number(i));
            }}
            defaultValue={"0"}
          >
            {initialData?.tokens.map(({ symbol }, index) => (
              <SelectItem key={symbol} value={index.toString()}>
                {symbol}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
}
