"use client";

import { Spinner } from "#/components/Spinner";
import { Tabs } from "#/components/Tabs";
import { useStableSwap } from "#/contexts/StableSwapContext";

import { DepthCost } from "../(components)/DepthCost";
import { ImpactCurve } from "../(components)/ImpactCurve";
import { StableCurve } from "../(components)/StableCurve";
import { SwapSimulator } from "../(components)/SwapSimulator";
import { TokensDistribution } from "../(components)/TokensDistribution";

export default function Page() {
  const {
    initialData,
    customData,
    indexAnalysisToken,
    setIndexCurrentTabToken,
    indexCurrentTabToken,
  } = useStableSwap();
  const tokensSymbol = initialData.tokens.map((token) => token.symbol);
  const tabTokens = tokensSymbol.filter(
    (token, index) => index !== indexAnalysisToken
  );

  if (
    !initialData ||
    !initialData.swapFee ||
    !initialData.ampFactor ||
    !initialData.tokens ||
    !customData ||
    !customData.swapFee ||
    !customData.ampFactor ||
    !customData.tokens
  ) {
    return <Spinner />;
  }

  function handleTabClick(event: React.FormEvent<HTMLButtonElement>) {
    const target = event.target as HTMLButtonElement;

    setIndexCurrentTabToken(tokensSymbol.indexOf(target.innerText));
  }

  return (
    <div className="flex max-h-[calc(100vh-132px)] w-full flex-col gap-y-20 overflow-auto pr-8 pt-8">
      {/* (h-screen - (header's height + footer's height)) = graph's height space */}
      <div className="basis-1/3">
        <div className="flex h-full w-full flex-row gap-x-5">
          <SwapSimulator />
          <TokensDistribution />
        </div>
      </div>
      <div className="basis-1/3">
        <DepthCost />
      </div>
      <div className="basis-2/3">
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
