"use client";

import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

export default function Page() {
  const { initialData, customData } = usePoolSimulator();

  return (
    <div>
      {[initialData, customData].map((data) => {
        return (
          <div className="flex lg:max-h-[calc(100vh-132px)] w-full flex-col gap-y-20 lg:overflow-auto pr-8 pt-8">
            {/* (h-screen - (header's height + footer's height)) = graph's height space */}
            <div className="text-slate12">{data.poolType}</div>
            <div>
              {data.poolParams
                ? Object.entries(data.poolParams).map(([key, value]) => {
                    return (
                      <div className="flex items-center gap-x-4">
                        <span className="text-slate12">{key}</span>
                        <span className="text-slate12">{value}</span>
                      </div>
                    );
                  })
                : null}
            </div>
            <div>
              {data.tokens.map((token, index) => {
                return (
                  <div className="flex items-center gap-x-4">
                    <span className="text-slate12">index</span>
                    <span className="text-slate12">{index}</span>
                    <span className="text-slate12">Symbol</span>
                    <span className="text-slate12">{token.symbol}</span>
                    <span className="text-slate12">Balance</span>
                    <span className="text-slate12">{token.balance}</span>
                    <span className="text-slate12">Rate</span>
                    <span className="text-slate12">{token.rate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
