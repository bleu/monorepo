import {
  amberDark,
  blueDark,
  brownDark,
  goldDark,
  greenDark,
  pinkDark,
  purpleDark,
  tomatoDark,
} from "@radix-ui/colors";

import { PlotTitle } from "#/components/Plot";
import { Tooltip } from "#/components/Tooltip";
import { TokensData, useStableSwap } from "#/contexts/StableSwapContext";

const colors = [
  blueDark.blue9,
  amberDark.amber9,
  purpleDark.purple9,
  tomatoDark.tomato9,
  greenDark.green9,
  pinkDark.pink9,
  brownDark.brown9,
  goldDark.gold9,
];

export function TokensDistribution() {
  const { initialData, customData } = useStableSwap();
  return (
    <div className="flex flex-col w-1/3 gap-y-2 text-slate12">
      <PlotTitle
        title="Tokens Distribution"
        tooltip="Indicates how much each token balance represent of the pool total"
        justifyCenter={false}
      />
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col">
          <label className="mb-2 block text-sm">Initial Distribution</label>
          <TokenDistributionChart tokens={initialData?.tokens} />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 block text-sm ">Custom Distribution</label>
          <TokenDistributionChart tokens={customData?.tokens} />
        </div>
      </div>
      <div className="flex h-1/3 gap-x-2">
        {initialData?.tokens.map((token, index) => (
          <div
            key={token.symbol}
            className="flex justify-center items-center gap-x-1 text-sm"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            {token.symbol}
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenDistributionChart({ tokens }: { tokens: TokensData[] }) {
  const balancesSum = tokens.reduce((sum, tokens) => sum + tokens.balance, 0);
  const balancesPercent = tokens.map(
    (token) => (token.balance * 100) / balancesSum
  );
  const lastBalanceWidth =
    100 -
    balancesPercent
      .slice(0, -1)
      .reduce((sum, percent) => sum + Math.floor(percent), 0);

  return (
    <div className="flex-1 flex w-full h-5 overflow-hidden rounded-2xl">
      {balancesPercent.map((balancePercent, index) => (
        <Tooltip
          key={tokens[index].symbol}
          content={`${tokens[index].symbol}: ${balancePercent.toFixed(2)}% (${
            tokens[index].balance
          })`}
        >
          <div
            key={tokens[index].symbol}
            className="h-5"
            style={{
              width:
                index + 1 == balancesPercent.length
                  ? `${lastBalanceWidth.toFixed()}%`
                  : `${balancePercent.toFixed()}%`,
              backgroundColor: colors[index],
            }}
          />
        </Tooltip>
      ))}
    </div>
  );
}
