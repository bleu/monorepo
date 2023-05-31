"use client";

import { Tabs } from "#/components/Tabs";
import { useStableSwap } from "#/contexts/StableSwapContext";

import { DepthCost } from "./DepthCost";
import { ImpactCurve } from "./ImpactCurve";
import { StableCurve } from "./StableCurve";

export function GraphView() {
  const {
    baselineData,
    indexAnalysisToken,
    setIndexCurrentTabToken,
    indexCurrentTabToken,
  } = useStableSwap();
  const tokensSymbol = baselineData.tokens.map((token) => token.symbol);
  const tabTokens = tokensSymbol.filter(
    (token, index) => index !== indexAnalysisToken
  );

  function handleTabClick(event: React.FormEvent<HTMLButtonElement>) {
    const target = event.target as HTMLButtonElement;

    setIndexCurrentTabToken(tokensSymbol.indexOf(target.innerText));
  }

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      <div className="basis-1/3">
        <div className="flex flex-row h-full w-full">
          <DepthCost />;
        </div>
      </div>
      <div className="basis-2/3">
        <Tabs defaultValue={tokensSymbol[indexCurrentTabToken]}>
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
              <Tabs.ItemContent tabName={symbol} bgColor="blue1">
                <StableCurve />
                <ImpactCurve />
              </Tabs.ItemContent>
            </div>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
