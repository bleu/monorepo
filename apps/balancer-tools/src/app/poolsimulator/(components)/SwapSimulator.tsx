import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";

import { Button } from "#/components";
import { BaseInput, Input } from "#/components/Input";
import { PlotTitle } from "#/components/Plot";
import { Select, SelectItem } from "#/components/Select";
import { Spinner } from "#/components/Spinner";
import { Form, FormField, FormLabel } from "#/components/ui/form";
import {
  AnalysisData,
  PoolPairData,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import { SwapSimulatorDataSchema } from "#/lib/schema";

import { PoolTypeEnum } from "../(types)";

interface IResult {
  swapType: string;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  amountIn: number;
  amountOut: number;
  effectivePrice: number;
  priceImpact: number;
}

export function SwapSimulator() {
  const { initialData, customData } = usePoolSimulator();
  const [initialResult, setInitialResult] = useState<IResult>({
    swapType: "",
    tokenInSymbol: "",
    tokenOutSymbol: "",
    amountIn: 0,
    amountOut: 0,
    effectivePrice: 0,
    priceImpact: 0,
  });
  const [customResult, setCustomResult] = useState<IResult>({
    swapType: "",
    tokenInSymbol: "",
    tokenOutSymbol: "",
    amountIn: 0,
    amountOut: 0,
    effectivePrice: 0,
    priceImpact: 0,
  });

  return (
    <div className="flex w-full flex-col gap-y-2 lg:border-r-2 lg:border-blue4 lg:pr-5 text-slate12">
      <PlotTitle
        title="Swap simulator"
        tooltip="Use the inputs on the left to simulate a swap and see the results based on the initial and custom parameters"
        justifyCenter={false}
      />
      <div className="grid grid-cols-3 gap-x-5">
        <Label className="text-md mb-2 block text-slate12">
          Swap parameters
        </Label>
        <Label className="text-md mb-2 block text-slate12 underline decoration-blue9 decoration-4">
          Initial simulation
        </Label>
        <Label className="text-md mb-2 block text-slate12 underline decoration-amber9 decoration-4">
          Custom simulation
        </Label>

        <SwapSimulatorForm
          setCustomResult={setCustomResult}
          setInitialResult={setInitialResult}
        />
        <SimulationResult {...initialResult} data={initialData} />
        <SimulationResult {...customResult} data={customData} />
      </div>
    </div>
  );
}

function calculateSimulation({
  amm,
  swapType,
  amount,
  tokenInSymbol,
  tokenOutSymbol,
}: {
  amm: AMM<PoolPairData>;
  swapType: string;
  amount: number;
  tokenInSymbol: string;
  tokenOutSymbol: string;
}) {
  if (tokenInSymbol == tokenOutSymbol || !tokenInSymbol || !tokenOutSymbol) {
    return {
      amountIn: amount,
      amountOut: amount,
      effectivePrice: 1,
      priceImpact: 0,
    };
  }
  let amountIn = amount;
  let amountOut = amm.exactTokenInForTokenOut(
    amount,
    tokenInSymbol,
    tokenOutSymbol,
  );
  let effectivePrice = amm.effectivePriceForExactTokenInSwap(
    amount,
    tokenInSymbol,
    tokenOutSymbol,
  );
  let priceImpact = amm.priceImpactForExactTokenInSwap(
    amount,
    tokenInSymbol,
    tokenOutSymbol,
  );

  if (swapType == "Exact Out") {
    amountIn = amm.tokenInForExactTokenOut(
      amount,
      tokenInSymbol,
      tokenOutSymbol,
    );
    amountOut = amount;
    effectivePrice = amm.effectivePriceForExactTokenOutSwap(
      amount,
      tokenInSymbol,
      tokenOutSymbol,
    );
    priceImpact = amm.priceImpactForExactTokenOutSwap(
      amount,
      tokenInSymbol,
      tokenOutSymbol,
    );
  }

  return {
    amountIn,
    amountOut,
    effectivePrice,
    priceImpact,
  };
}

function SwapSimulatorForm({
  setInitialResult,
  setCustomResult,
}: {
  setInitialResult: React.Dispatch<React.SetStateAction<IResult>>;
  setCustomResult: React.Dispatch<React.SetStateAction<IResult>>;
}) {
  const { initialData, initialAMM, customAMM } = usePoolSimulator();

  if (!initialData || !initialAMM || !customAMM) return <Spinner />;

  const form = useForm({
    resolver: zodResolver(SwapSimulatorDataSchema),
    mode: "onSubmit",
  });
  const {
    control,
    formState: { errors },
  } = form;

  const swapTypes = ["Exact In", "Exact Out"];
  const tokensSymbol = initialData?.tokens.map((token) => token.symbol);
  const defaultSwapType = "Exact In";
  const defaultTokenInIndex = "0";
  const defaultTokenOutIndex = "1";
  const defaultAmount = (initialData?.tokens[0]?.balance / 10).toFixed(2);

  const onSubmit = (data: FieldValues) => {
    const tokenInSymbol = tokensSymbol?.[Number(data.tokenInIndex)];
    const tokenOutSymbol = tokensSymbol?.[Number(data.tokenOutIndex)];
    const initialResult = calculateSimulation({
      amm: initialAMM,
      swapType: data.swapType as string,
      amount: Number(data.amount),
      tokenInSymbol: tokenInSymbol,
      tokenOutSymbol: tokenOutSymbol,
    });
    const customResult = calculateSimulation({
      amm: customAMM,
      swapType: data.swapType as string,
      amount: Number(data.amount),
      tokenInSymbol: tokenInSymbol,
      tokenOutSymbol: tokenOutSymbol,
    });
    setInitialResult({
      swapType: data.swapType as string,
      tokenInSymbol: tokenInSymbol,
      tokenOutSymbol: tokenOutSymbol,
      ...initialResult,
    });
    setCustomResult({
      swapType: data.swapType as string,
      tokenInSymbol: tokenInSymbol,
      tokenOutSymbol: tokenOutSymbol,
      ...customResult,
    });
  };

  useEffect(() => {
    const defaultInitialResult = calculateSimulation({
      amm: initialAMM,
      swapType: defaultSwapType,
      amount: Number(defaultAmount),
      tokenInSymbol: tokensSymbol?.[Number(defaultTokenInIndex)],
      tokenOutSymbol: tokensSymbol?.[Number(defaultTokenOutIndex)],
    });
    const defaultCustomResult = calculateSimulation({
      amm: customAMM,
      swapType: defaultSwapType,
      amount: Number(defaultAmount),
      tokenInSymbol: tokensSymbol?.[Number(defaultTokenInIndex)],
      tokenOutSymbol: tokensSymbol?.[Number(defaultTokenOutIndex)],
    });
    setInitialResult({
      swapType: defaultSwapType,
      tokenInSymbol: tokensSymbol?.[Number(defaultTokenInIndex)],
      tokenOutSymbol: tokensSymbol?.[Number(defaultTokenOutIndex)],
      ...defaultInitialResult,
    });
    setCustomResult({
      swapType: defaultSwapType,
      tokenInSymbol: tokensSymbol?.[Number(defaultTokenInIndex)],
      tokenOutSymbol: tokensSymbol?.[Number(defaultTokenOutIndex)],
      ...defaultCustomResult,
    });
  }, [initialAMM, customAMM]);

  return (
    <Form {...form} onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <FormLabel className="mb-2 block text-sm text-slate12">
            Token In
          </FormLabel>
          <Controller
            control={control}
            name="tokenInIndex"
            defaultValue={defaultTokenInIndex}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                onValueChange={onChange}
                value={value as string}
                ref={ref}
                className="w-full"
              >
                {tokensSymbol.map((tokenSymbol, index) => (
                  <SelectItem key={tokenSymbol} value={index.toString()}>
                    {tokenSymbol}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <div>
          <FormLabel className="mb-2 block text-sm text-slate12">
            Token Out
          </FormLabel>
          <Controller
            control={control}
            name="tokenOutIndex"
            defaultValue={defaultTokenOutIndex}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                onValueChange={onChange}
                value={value as string}
                ref={ref}
                className="w-full"
              >
                {initialData.tokens.map(({ symbol }, index) => (
                  <SelectItem key={symbol} value={index.toString()}>
                    {symbol}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        {errors[""] && (
          <div className="col-span-2">
            <span className="text-tomato10">
              {errors[""]?.message as string}
            </span>
          </div>
        )}
        <div>
          <FormLabel className="mb-2 block text-sm text-slate12">
            Swap Type
          </FormLabel>
          <Controller
            control={control}
            name="swapType"
            defaultValue={defaultSwapType}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                onValueChange={onChange}
                value={value as string}
                ref={ref}
                className="w-full"
              >
                {swapTypes.map((swapType) => (
                  <SelectItem key={swapType} value={swapType}>
                    {swapType}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <div>
          <FormField
            name="amount"
            render={({ field }) => (
              <Input
                {...field}
                label="Amount"
                type="number"
                defaultValue={defaultAmount}
              />
            )}
          />
        </div>
        <div className="col-span-2 mt-4">
          <Button className="w-full" type="submit">
            Re-calculate swap
          </Button>
        </div>
      </div>
    </Form>
  );
}

function ErrorMessage({
  errorMessage,
  errorTitle,
}: {
  errorMessage: string;
  errorTitle: string;
}) {
  return (
    <div role="alert">
      <div className="bg-tomato9 text-slate12 font-bold rounded-t px-4 py-2">
        Error: {errorTitle}
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-tomato12 px-4 py-3 text-tomato7">
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}

function SimulationResult({
  swapType,
  tokenInSymbol,
  tokenOutSymbol,
  data,
  amountIn,
  amountOut,
  effectivePrice,
  priceImpact,
}: {
  swapType: string;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  data: AnalysisData;
  amountIn?: number;
  amountOut?: number;
  effectivePrice?: number;
  priceImpact?: number;
}) {
  if (!data.poolType) {
    return <Spinner />;
  }
  // When CLP is out of bounds in an exactIn swap it returns 0
  if (
    (data.poolType === PoolTypeEnum.Gyro2 ||
      data.poolType === PoolTypeEnum.Gyro3 ||
      data.poolType === PoolTypeEnum.GyroE) &&
    (!amountOut ||
      amountOut >
        (data.tokens.find((t) => t.symbol === tokenOutSymbol)
          ?.balance as number))
  ) {
    return (
      <ErrorMessage
        errorTitle="CLP limit"
        errorMessage="The swap is greater than the pool limit. Please, change the amount to a lower value."
      />
    );
  }
  if (!amountIn || !amountOut || !effectivePrice || !priceImpact)
    return <Spinner />;

  return (
    <div className="flex flex-col gap-y-2">
      {swapType == "Exact In" ? (
        <>
          <Label className="block text-sm text-slate12">Amount Out</Label>
          <BaseInput
            label="Amount Out"
            value={`${amountOut.toFixed(2)} ${tokenOutSymbol}`}
            disabled
          />
        </>
      ) : (
        <>
          <Label className="block text-sm text-slate12">Amount In</Label>
          <BaseInput
            value={`${amountIn.toFixed(2)} ${tokenInSymbol}`}
            disabled
          />
        </>
      )}
      <Label className="block text-sm text-slate12">Effective Price</Label>
      <BaseInput
        value={`${effectivePrice.toFixed(
          2,
        )} ${tokenInSymbol}/${tokenOutSymbol}`}
        disabled
      />
      <Label className="block text-sm text-slate12">Price Impact</Label>
      <BaseInput
        label="Price Impact"
        value={`${(priceImpact * 100).toFixed(2)} %`}
        disabled
      />
    </div>
  );
}
