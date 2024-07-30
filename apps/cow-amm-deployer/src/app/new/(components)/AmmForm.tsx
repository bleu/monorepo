import { Address } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { formatUnits, parseUnits } from "viem";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { SelectInput } from "#/components/SelectInput";
import { Spinner } from "#/components/Spinner";
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
import { useFallbackState } from "#/hooks/useFallbackState";
import { useRawTxData } from "#/hooks/useRawTxData";
import { fetchTokenUsdPrice } from "#/lib/fetchTokenUsdPrice";
import { ammFormSchema } from "#/lib/schema";
import { buildTxAMMArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { FALLBACK_STATES, IToken, PRICE_ORACLES } from "#/lib/types";
import { cn } from "#/lib/utils";
import { ChainId } from "#/utils/chainsPublicClients";

import { BalancerWeightedForm } from "./BalancerWeightedForm";
import { ChainlinkForm } from "./ChainlinkForm";
import { CustomOracleForm } from "./CustomOracleForm";
import { FallbackAndDomainWarning } from "./FallbackAndDomainWarning";
import { SushiForm } from "./SushiForm";
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
          newToken0.decimals,
        ),
      ),
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
    resolver: zodResolver(ammFormSchema),
    defaultValues: {
      ...defaultValues,
      safeAddress: safeAddress as Address,
      chainId,
    },
  });

  const {
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const { fallbackState, domainSeparator } = useFallbackState();
  const { sendTransactions } = useRawTxData();
  const [confirmedFallbackSetup, setConfirmedFallbackSetup] = useState(false);

  const formData = watch();

  const onSubmit = async (data: typeof ammFormSchema._type) => {
    await buildTxAMMArgs({ data, transactionType })
      .then((txArgs) => {
        sendTransactions(txArgs);
      })
      .catch((e: Error) => {
        // eslint-disable-next-line no-console
        console.error(e);
      })
      .then(() => {
        router.push("/createtxprocessing");
      });
  };

  useEffect(() => {
    if (fallbackState && domainSeparator) {
      setValue("domainSeparator", domainSeparator);
      setValue("fallbackSetupState", fallbackState);
    }
  }, [fallbackState, setValue]);

  useEffect(() => {
    setValue("safeAddress", safeAddress as Address);
  }, [safeAddress, setValue]);

  if (!fallbackState || !domainSeparator) {
    return <Spinner />;
  }

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
                  address: token.address as Address,
                  symbol: token.symbol,
                });
                setValue(
                  "minTradedToken0",
                  await getNewMinTradeToken0(token, chainId as ChainId),
                );
              }}
              selectedToken={formData?.token0 ?? undefined}
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
                  address: token.address as Address,
                  symbol: token.symbol,
                });
              }}
              selectedToken={formData?.token1 ?? undefined}
            />
            {errors.token1 && (
              <FormMessage className="mt-1 h-6 text-sm text-destructive">
                <span>{errors.token1.message}</span>
              </FormMessage>
            )}
          </div>
        </div>
      </div>
      <PriceOracleFields form={form} />
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="advancedOptions" key="advancedOption">
          <AccordionTrigger
            className={cn(
              errors.minTradedToken0 ? "text-destructive" : "",
              "pt-0",
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

      {fallbackState !== FALLBACK_STATES.HAS_DOMAIN_VERIFIER && (
        <FallbackAndDomainWarning
          confirmedFallbackSetup={confirmedFallbackSetup}
          setConfirmedFallbackSetup={setConfirmedFallbackSetup}
        />
      )}
      <div className="flex justify-center gap-x-5 mt-2">
        <Button
          loading={isSubmitting}
          variant="highlight"
          type="submit"
          className="w-full"
          disabled={
            (fallbackState != FALLBACK_STATES.HAS_DOMAIN_VERIFIER &&
              !confirmedFallbackSetup) ||
            isSubmitting ||
            !(formData?.token0 && formData?.token1 && formData?.priceOracle)
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
    unregister,
  } = form;

  const priceOracle = watch("priceOracle");

  const unregisterFields = (selectedPriceOracle: PRICE_ORACLES) => {
    if (selectedPriceOracle !== PRICE_ORACLES.BALANCER)
      unregister("balancerPoolId");
    if (selectedPriceOracle !== PRICE_ORACLES.UNI) unregister("uniswapV2Pair");
    if (selectedPriceOracle !== PRICE_ORACLES.SUSHI) unregister("sushiV2Pair");
    if (selectedPriceOracle !== PRICE_ORACLES.CHAINLINK) {
      unregister("chainlinkPriceFeed0");
      unregister("chainlinkPriceFeed1");
      unregister("chainlinkTimeThresholdInHours");
    }
    if (selectedPriceOracle !== PRICE_ORACLES.CUSTOM) {
      unregister("customPriceOracleAddress");
      unregister("customPriceOracleData");
    }
  };

  useEffect(() => {
    unregisterFields(priceOracle);
  }, [priceOracle]);

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
              <InfoCircledIcon className="size-4 text-secondary-foreground" />
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
