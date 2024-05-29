import { toast } from "@bleu/ui";
import { Address } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { brownDark } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { formatUnits, parseUnits } from "viem";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { SelectInput } from "#/components/SelectInput";
import { TokenSelect } from "#/components/TokenSelect";
import { Tooltip } from "#/components/Tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Form, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import { useRawTxData } from "#/hooks/useRawTxData";
import { IToken } from "#/lib/fetchAmmData";
import { ammFormSchema } from "#/lib/schema";
import { fetchTokenUsdPrice } from "#/lib/tokenUtils";
import { buildTxAMMArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { PRICE_ORACLES } from "#/lib/types";
import { cn } from "#/lib/utils";
import { ChainId } from "#/utils/chainsPublicClients";

import { BalancerWeightedForm } from "./BalancerWeightedForm";
import { ChainlinkForm } from "./ChainlinkForm";
import { CustomOracleForm } from "./CustomOracleForm";
import { SushiForm } from "./SushiForm";
import { TokenAmountInput } from "./TokenAmountInput";
import { UniswapV2Form } from "./UniswapV2Form";

const getNewMinTradeToken0 = async (newToken0: IToken, chainId: ChainId) => {
  return fetchTokenUsdPrice({
    tokenAddress: newToken0.address as Address,
    tokenDecimals: newToken0.decimals,
    chainId,
  })
    .then((price) => 10 / price)
    .then((amount) =>
      // Format and parse to round on the right number of decimals
      Number(
        formatUnits(
          parseUnits(String(amount), newToken0.decimals),
          newToken0.decimals
        )
      )
    )
    .catch(() => 0);
};

export function AmmForm({
  transactionType,
  defaultValues,
}: {
  transactionType:
    | TRANSACTION_TYPES.CREATE_COW_AMM
    | TRANSACTION_TYPES.EDIT_COW_AMM;
  defaultValues?: FieldValues;
}) {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();
  const router = useRouter();

  const form = useForm<typeof ammFormSchema._type>({
    // @ts-ignore
    resolver: zodResolver(ammFormSchema),
    defaultValues: {
      ...defaultValues,
      safeAddress,
      chainId,
    },
  });

  const {
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const { sendTransactions } = useRawTxData();

  const formData = watch();

  const onSubmit = async (data: typeof ammFormSchema._type) => {
    const txArgs = buildTxAMMArgs({ data, transactionType });

    try {
      await sendTransactions(txArgs);
      router.push("/createtxprocessing");
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setValue("safeAddress", safeAddress);
  }, [safeAddress, setValue]);

  return (
    <Form
      {...form}
      onSubmit={onSubmit}
      className="flex flex-col gap-y-3 px-9 pb-9"
    >
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full">
            <span className="mb-2 h-5 block text-sm">Token Pair</span>
            <TokenSelect
              onSelectToken={async (token: IToken) => {
                setValue("token0", {
                  decimals: token.decimals,
                  address: token.address,
                  symbol: token.symbol,
                });
                setValue(
                  "minTradedToken0",
                  await getNewMinTradeToken0(token, chainId as ChainId)
                );
              }}
              selectedToken={(formData?.token0 as IToken) ?? undefined}
            />
            {errors.token0 && (
              <FormMessage className="mt-1 h-6 text-sm text-destructive">
                <span>{errors.token0.message}</span>
              </FormMessage>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col">
            <span className="mb-2 h-5 block text-sm text-transparent">
              Select pair
            </span>
            <TokenSelect
              onSelectToken={(token: IToken) => {
                setValue("token1", {
                  decimals: token.decimals,
                  address: token.address,
                  symbol: token.symbol,
                });
              }}
              selectedToken={(formData?.token1 as IToken) ?? undefined}
            />
            {errors.token1 && (
              <FormMessage className="mt-1 h-6 text-sm text-destructive">
                <span>{errors.token1.message}</span>
              </FormMessage>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full">
            <span className="mb-2 h-5 block text-sm">Token amounts</span>
            <TokenAmountInput
              tokenFieldForm="token0"
              form={form}
              fieldName="amount0"
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col">
            <span className="mb-2 h-5 block text-sm text-transparent" />
            <TokenAmountInput
              tokenFieldForm="token1"
              form={form}
              fieldName="amount1"
            />
          </div>
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
              step={10 ** (-formData?.token0?.decimals || 18)}
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
          disabled={
            isSubmitting ||
            !(
              formData?.token0 &&
              formData?.token1 &&
              formData?.priceOracle &&
              formData?.amount0 &&
              formData?.amount1
            )
          }
        >
          <span>
            {transactionType === TRANSACTION_TYPES.CREATE_COW_AMM
              ? "Create AMM"
              : "Edit AMM"}
          </span>
        </Button>
      </div>
    </Form>
  );
}

function PriceOracleFields({
  form,
}: {
  form: UseFormReturn<typeof ammFormSchema._type>;
}) {
  const {
    setValue,
    formState: { errors },
    watch,
  } = form;

  const priceOracle = watch("priceOracle");

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
              setValue("priceOracle", priceOracle as PRICE_ORACLES);
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
