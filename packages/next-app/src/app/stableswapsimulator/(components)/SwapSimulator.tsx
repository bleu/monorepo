import { OldBigNumber } from "@balancer-labs/sor";
import { MetaStableMath } from "@balancer-pool-metadata/math/src";
import { Controller, useForm } from "react-hook-form";

import { BaseInput, Input } from "#/components/Input";
import { PlotTitle } from "#/components/Plot";
import { Select, SelectItem } from "#/components/Select";
import { Spinner } from "#/components/Spinner";
import { Form, FormField } from "#/components/ui/form";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import useDebounce from "#/hooks/useDebounce";

export function SwapSimulator() {
  const form = useForm();
  const { watch, control } = form;

  const swapTypes = ["Exact In", "Exact Out"];
  const { initialData, customData } = useStableSwap();
  const tokensSymbol = initialData?.tokens.map((token) => token.symbol);

  const amount = watch("amount");
  const swapType = watch("swapType");
  const tokenInIndex = watch("tokenInIndex");
  const tokenOutIndex = watch("tokenOutIndex");
  const debouncedAmount = useDebounce(amount);

  const tokenInSymbol = initialData?.tokens[tokenInIndex]?.symbol;
  const tokenOutSymbol = initialData?.tokens[tokenOutIndex]?.symbol;

  const initialResult = calculateSimulation({
    amount: Number(debouncedAmount),
    swapType,
    tokenInIndex,
    tokenOutIndex,
    data: initialData,
  });

  const customResult = calculateSimulation({
    amount: Number(debouncedAmount),
    swapType,
    tokenInIndex,
    tokenOutIndex,
    data: customData,
  });

  function SimulationResult({
    amountIn,
    amountOut,
    effectivePrice,
    priceImpact,
  }: {
    amountIn?: number;
    amountOut?: number;
    effectivePrice?: number;
    priceImpact?: number;
  }) {
    if (!amountIn || !amountOut || !effectivePrice || !priceImpact)
      return <Spinner />;

    return (
      <div className="flex flex-col gap-y-2">
        {swapType == "Exact In" ? (
          <>
            <label className="block text-sm text-slate12">Amount Out</label>
            <BaseInput
              label="Amount Out"
              value={`${amountOut.toFixed(2)} ${tokenOutSymbol}`}
              disabled
            />
          </>
        ) : (
          <>
            <label className="block text-sm text-slate12">Amount In</label>
            <BaseInput
              value={`${amountIn.toFixed(2)} ${tokenInSymbol}`}
              disabled
            />
          </>
        )}
        <label className="block text-sm text-slate12">Effective Price</label>
        <BaseInput
          value={`${effectivePrice.toFixed(
            2
          )} ${tokenOutSymbol}/${tokenInSymbol}`}
          disabled
        />
        <label className="block text-sm text-slate12">Price Impact</label>
        <BaseInput
          label="Price Impact"
          value={`${(priceImpact * 100).toFixed(2)} %`}
          disabled
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-2 border-r-2 border-blue4 pr-5 text-slate12">
      <PlotTitle
        title="Swap simulator"
        tooltip="Use the inputs on the left to simulate a swap and see the results based on the initial and custom parameters"
        justifyCenter={false}
      />
      <Form {...form} onSubmit={() => undefined}>
        <div className="flex w-full flex-row gap-x-5">
          <div className="flex w-1/3 flex-col gap-y-2">
            <label className="text-md mb-2 block text-slate12">
              Swap parameters
            </label>
            <div className="flex flex-row justify-between gap-x-2">
              <div className="flex w-1/2 flex-col">
                <label className="mb-2 block text-sm text-slate12">
                  Token In
                </label>
                <Controller
                  control={control}
                  name="tokenInIndex"
                  defaultValue="0"
                  render={({ field: { onChange, value, ref } }) => (
                    <Select onValueChange={onChange} value={value} ref={ref}>
                      {tokensSymbol.map((tokenSymbol, index) => (
                        <SelectItem key={tokenSymbol} value={index.toString()}>
                          {tokenSymbol}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="flex w-1/2 flex-col">
                <label className="mb-2 block text-sm text-slate12">
                  Token Out
                </label>
                <Controller
                  control={control}
                  name="tokenOutIndex"
                  defaultValue="1"
                  render={({ field: { onChange, value, ref } }) => (
                    <Select onValueChange={onChange} value={value} ref={ref}>
                      {tokensSymbol.map((tokenSymbol, index) => (
                        <SelectItem key={tokenSymbol} value={index.toString()}>
                          {tokenSymbol}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 block text-sm text-slate12">
                Swap Type
              </label>
              <Controller
                control={control}
                name="swapType"
                defaultValue="Exact In"
                render={({ field: { onChange, value, ref } }) => (
                  <Select onValueChange={onChange} value={value} ref={ref}>
                    {swapTypes.map((swapType) => (
                      <SelectItem key={swapType} value={swapType}>
                        {swapType}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            <FormField
              name="amount"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Amount"
                  type="number"
                  defaultValue={(initialData?.tokens[0]?.balance / 10).toFixed(
                    2
                  )}
                />
              )}
            />
          </div>
          <div className="flex w-1/3 flex-col gap-y-2">
            <label className="text-md mb-2 block text-slate12 underline decoration-blue9 decoration-4">
              Initial simulation
            </label>
            <SimulationResult {...initialResult} />
          </div>
          <div className="flex w-1/3 flex-col gap-y-2">
            <label className="text-md mb-2 block text-slate12 underline decoration-amber9 decoration-4">
              Custom simulation
            </label>
            <div className="flex flex-col gap-y-2">
              <SimulationResult {...customResult} />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

function calculateSimulation({
  data,
  swapType,
  amount,
  tokenInIndex,
  tokenOutIndex,
}: {
  data: AnalysisData;
  swapType: string;
  amount: number;
  tokenInIndex: number;
  tokenOutIndex: number;
}) {
  if (
    !data?.swapFee ||
    !data?.ampFactor ||
    !data?.tokens ||
    !amount ||
    typeof tokenInIndex == "undefined" ||
    typeof tokenOutIndex == "undefined" ||
    tokenInIndex == tokenOutIndex
  ) {
    return;
  }

  const poolPairData = MetaStableMath.preparePoolPairData({
    indexIn: tokenInIndex,
    indexOut: tokenOutIndex,
    swapFee: data?.swapFee,
    balances: data?.tokens.map((token) => token.balance),
    amp: data?.ampFactor,
    rates: data?.tokens.map((token) => token.rate),
    decimals: data?.tokens.map((token) => token.decimal),
  });

  const OldBigNumberAmount = MetaStableMath.numberToOldBigNumber(
    amount
  ) as OldBigNumber;

  let amountIn = OldBigNumberAmount;
  let amountOut = MetaStableMath.exactTokenInForTokenOut(
    OldBigNumberAmount,
    poolPairData
  );
  let effectivePrice = MetaStableMath.effectivePriceForExactTokenInSwap(
    OldBigNumberAmount,
    poolPairData
  );
  let priceImpact = MetaStableMath.priceImpactForExactTokenInSwap(
    OldBigNumberAmount,
    poolPairData
  );

  if (swapType == "Exact Out") {
    amountIn = MetaStableMath.tokenInForExactTokenOut(
      OldBigNumberAmount,
      poolPairData
    );
    amountOut = OldBigNumberAmount;
    effectivePrice = MetaStableMath.effectivePriceForExactTokenOutSwap(
      OldBigNumberAmount,
      poolPairData
    );
    priceImpact = MetaStableMath.priceImpactForExactTokenOutSwap(
      OldBigNumberAmount,
      poolPairData
    );
  }

  return {
    amountIn,
    amountOut,
    effectivePrice,
    priceImpact,
  };
}
