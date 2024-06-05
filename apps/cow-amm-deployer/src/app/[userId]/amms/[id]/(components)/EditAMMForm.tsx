"use client";

import { toast } from "@bleu/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { brownDark } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { Address, formatUnits } from "viem";

import { Button } from "#/components";
import { BalancerWeightedForm } from "#/components/BalancerWeightedForm";
import { ChainlinkForm } from "#/components/ChainlinkForm";
import { CustomOracleForm } from "#/components/CustomOracleForm";
import { Input } from "#/components/Input";
import { SelectInput } from "#/components/SelectInput";
import { SushiForm } from "#/components/SushiForm";
import { TokenInfo } from "#/components/TokenInfo";
import { Tooltip } from "#/components/Tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Form, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import { UniswapV2Form } from "#/components/UniswapV2Form";
import { useRawTxData } from "#/hooks/useRawTxData";
import { ICowAmm } from "#/lib/fetchAmmData";
import { ammEditSchema } from "#/lib/schema";
import { buildTxEditAMMArgs } from "#/lib/transactionFactory";
import { PRICE_ORACLES, PriceOraclesValue } from "#/lib/types";
import { cn } from "#/lib/utils";

export function EditAMMForm({
  cowAmmData,
  submitButtonText,
}: {
  cowAmmData: ICowAmm;
  submitButtonText: string;
}) {
  const router = useRouter();

  const form = useForm<typeof ammEditSchema._type>({
    // @ts-ignore
    resolver: zodResolver(ammEditSchema),
    defaultValues: {
      safeAddress: cowAmmData.user.address,
      chainId: cowAmmData.chainId,
      token0: cowAmmData.token0,
      token1: cowAmmData.token1,
      minTradedToken0: Number(
        formatUnits(cowAmmData.minTradedToken0, cowAmmData.token0.decimals)
      ),
      priceOracle: cowAmmData.decodedPriceOracleData[0],
      balancerPoolId: cowAmmData.decodedPriceOracleData[1].balancerPoolId,
      uniswapV2Pair: cowAmmData.decodedPriceOracleData[1].uniswapV2PairAddress,
      sushiV2Pair: cowAmmData.decodedPriceOracleData[1].sushiSwapPairAddress,
      chainlinkPriceFeed0:
        cowAmmData.decodedPriceOracleData[1].chainlinkPriceFeed0,
      chainlinkPriceFeed1:
        cowAmmData.decodedPriceOracleData[1].chainlinkPriceFeed1,
      chainlinkTimeThresholdInHours:
        cowAmmData.decodedPriceOracleData[1].chainlinkTimeThresholdInHours,
      customPriceOracleAddress:
        cowAmmData.decodedPriceOracleData[1].customPriceOracleAddress,
      customPriceOracleData:
        cowAmmData.decodedPriceOracleData[1].customPriceOracleData,
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;
  const { sendTransactions } = useRawTxData();

  const onSubmit = async (data: typeof ammEditSchema._type) => {
    const txArgs = buildTxEditAMMArgs({
      data: data,
      ammAddress: cowAmmData.order.owner as Address,
    });

    try {
      await sendTransactions(txArgs);
      router.push(`/${cowAmmData.user.id}/amms/${cowAmmData.id}`);
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-3">
      <div className="flex flex-col w-full">
        <span className="mb-2 h-5 block text-sm">Token Pair</span>
        <div className="flex h-fit gap-x-7">
          <TokenInfo token={cowAmmData.token0} />
          <TokenInfo token={cowAmmData.token1} />
        </div>
      </div>
      <PriceOracleFields form={form} />
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="advancedOptions" key="advancedOption">
          <AccordionTrigger
            className={cn(
              errors.minTradedToken0 ? "text-destructive" : "",
              "pt-0"
            )}
          >
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <Input
              label="Minimum first token amount on each order"
              type="number"
              step={10 ** -cowAmmData.token0.decimals}
              name="minTradedToken0"
              tooltipText="This parameter is used to not overload the CoW Orderbook with small orders. By default, 10 dollars worth of the first token will be the minimum amount for each order."
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-center gap-x-5 mt-2">
        <Button
          loading={isSubmitting}
          variant="highlight"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          <span>{submitButtonText}</span>
        </Button>
      </div>
    </Form>
  );
}

function PriceOracleFields({
  form,
}: {
  form: UseFormReturn<typeof ammEditSchema._type>;
}) {
  const {
    setValue,
    control,
    formState: { errors },
  } = form;

  const priceOracle = useWatch({ control, name: "priceOracle" });

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-x-7">
        <div className="w-full">
          <div className="flex gap-x-2 mb-2">
            <Label>Price Oracle Source</Label>
            <Tooltip
              content={
                "The AMM relies on price oracle exclusively for generating orders that will plausibly be settled in the current market conditions"
              }
            >
              <InfoCircledIcon className="size-4" color={brownDark.brown8} />
            </Tooltip>
          </div>
          <SelectInput
            name="priceOracle"
            options={Object.values(PRICE_ORACLES).map((value) => ({
              id: value,
              value,
            }))}
            onValueChange={(priceOracle) => {
              setValue("priceOracle", priceOracle as PriceOraclesValue);
            }}
            placeholder={priceOracle}
          />
          {errors.priceOracle && (
            <FormMessage className="text-sm text-destructive w-full">
              <p className="text-wrap">
                {errors.priceOracle.message as string}
              </p>
            </FormMessage>
          )}
        </div>
      </div>

      {priceOracle === PRICE_ORACLES.BALANCER && (
        <BalancerWeightedForm form={form} />
      )}
      {priceOracle === PRICE_ORACLES.UNI && <UniswapV2Form form={form} />}
      {priceOracle === PRICE_ORACLES.CUSTOM && <CustomOracleForm form={form} />}
      {priceOracle === PRICE_ORACLES.SUSHI && <SushiForm form={form} />}
      {priceOracle === PRICE_ORACLES.CHAINLINK && <ChainlinkForm form={form} />}
    </div>
  );
}
