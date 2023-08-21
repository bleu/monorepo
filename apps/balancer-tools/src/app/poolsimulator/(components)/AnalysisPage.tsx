"use client";

import { AlertCard } from "#/components/AlertCard";
import { Tabs } from "#/components/Tabs";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../(types)";
import { ImpactCurve } from "./Curves/ImpactCurve";
import { SwapCurve } from "./Curves/SwapCurve";
import { DepthCost } from "./DepthCost";
import { SwapSimulator } from "./SwapSimulator";
import { TokensDistribution } from "./TokensDistribution";

const stablePoolTypes = [
  PoolTypeEnum.Fx,
  PoolTypeEnum.MetaStable,
  PoolTypeEnum.GyroE,
];

export default function Page() {
  const { initialData, customData, analysisToken, setCurrentTabTokenByIndex } =
    usePoolSimulator();

  const indexCurrentTabToken = initialData?.tokens.findIndex(
    ({ symbol }) => symbol.toLowerCase() !== analysisToken.symbol.toLowerCase(),
  );
  const tokensSymbol = initialData.tokens.map((token) => token.symbol);
  const tabTokens = tokensSymbol.filter(
    (token) => token !== analysisToken.symbol,
  );

  function handleTabClick(event: React.FormEvent<HTMLButtonElement>) {
    const target = event.target as HTMLButtonElement;

    setCurrentTabTokenByIndex(tokensSymbol.indexOf(target.innerText));
  }

  const poolTypes = [initialData?.poolType, customData?.poolType];
  const poolsHaveDifferentPurpose =
    poolTypes.filter((type) => stablePoolTypes.includes(type)).length == 1; // length equal one means that

  return (
    <>
      <div className="flex lg:max-h-[calc(100vh-132px)] w-full flex-col gap-y-20 lg:overflow-auto pr-8 pt-8">
        {/* (h-screen - (header's height + footer's height)) = graph's height space */}
        {poolsHaveDifferentPurpose && (
          <AlertCard
            style="warning"
            title="Pools with purposes"
            message="One of the pools was made for stable assets, while the other for non-stable. This may lead to results with different scale ranges."
          />
        )}
        <div>
          <div className="flex h-full w-full flex-col lg:flex-row gap-5">
            <SwapSimulator />
            <TokensDistribution />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-[95%] xl:w-[95%] max-w-[calc(100vw-320px)]">
            <DepthCost />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-[95%] xl:w-[95%] max-w-[calc(100vw-320px)]">
            <Tabs
              defaultValue={tokensSymbol[indexCurrentTabToken]}
              value={tokensSymbol[indexCurrentTabToken]}
            >
              <Tabs.ItemTriggerWrapper>
                {tabTokens.map((symbol) => (
                  <Tabs.ItemTrigger
                    tabName={symbol}
                    key={symbol}
                    onClick={handleTabClick}
                  >
                    <span>{symbol}</span>
                  </Tabs.ItemTrigger>
                ))}
              </Tabs.ItemTriggerWrapper>
              {tabTokens.map((symbol) => (
                <div key={symbol}>
                  <Tabs.ItemContent tabName={symbol} bgColor="bg-blue1">
                    <div className="flex flex-col gap-y-10 py-4">
                      <SwapCurve />
                      <ImpactCurve />
                    </div>
                  </Tabs.ItemContent>
                </div>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
