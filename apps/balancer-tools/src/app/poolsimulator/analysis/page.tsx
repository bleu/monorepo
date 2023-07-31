"use client";

import { Spinner } from "#/components/Spinner";
import { Tabs } from "#/components/Tabs";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

import { DepthCost } from "../(components)/DepthCost";
import { ImpactCurve } from "../(components)/ImpactCurve";
import { StableCurve } from "../(components)/StableCurve";
import { SwapSimulator } from "../(components)/SwapSimulator";
import { TokensDistribution } from "../(components)/TokensDistribution";

export default function Page() {
  const { initialData, analysisToken, setCurrentTabTokenByIndex } =
    usePoolSimulator();

  if (!analysisToken.symbol) {
    return <Spinner />;
  }
  const indexCurrentTabToken = initialData?.tokens.findIndex(
    ({ symbol }) => symbol.toLowerCase() !== analysisToken.symbol.toLowerCase()
  );
  const tokensSymbol = initialData.tokens.map((token) => token.symbol);
  const tabTokens = tokensSymbol.filter(
    (token) => token !== analysisToken.symbol
  );

  function handleTabClick(event: React.FormEvent<HTMLButtonElement>) {
    const target = event.target as HTMLButtonElement;

    setCurrentTabTokenByIndex(tokensSymbol.indexOf(target.innerText));
  }

  return (
    <div className="flex lg:max-h-[calc(100vh-132px)] w-full flex-col gap-y-20 lg:overflow-auto pr-8 pt-8">
      {/* (h-screen - (header's height + footer's height)) = graph's height space */}
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
                    <StableCurve />
                    <ImpactCurve />
                  </div>
                </Tabs.ItemContent>
              </div>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
