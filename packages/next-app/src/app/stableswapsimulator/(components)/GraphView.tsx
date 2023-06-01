"use client";

import { Tabs } from "#/components/Tabs";
import { useStableSwap } from "#/contexts/StableSwapContext";

import { DepthCost } from "./DepthCost";
import { ImpactCurve } from "./ImpactCurve";
import { StableCurve } from "./StableCurve";
import { TokensDistribution } from "./TokensDistribution";

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
    <div className="flex flex-col h-full w-full overflow-auto gap-y-2">
      <div className="basis-1/3">
        <div className="flex flex-row h-full w-full">
          <DepthCost />;
          <TokensDistribution />
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
  );
}
