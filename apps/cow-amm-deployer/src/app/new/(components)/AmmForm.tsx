import { Address } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { TokenBalance } from "@gnosis.pm/safe-apps-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { brownDark } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Spinner } from "#/components/Spinner";
import { Toast } from "#/components/Toast";
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
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { pools } from "#/lib/gqlBalancer";
import { pairs } from "#/lib/gqlUniswapV2";
import { ammFormSchema } from "#/lib/schema";
import { buildTxAMMArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { FALLBACK_STATES, IToken, PRICE_ORACLES } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

import { FallbackAndDomainWarning } from "./FallbackAndDomainWarning";
import { TokenSelect } from "./TokenSelect";

const getNewMinTradeToken0 = (newToken0: IToken, assets: TokenBalance[]) => {
  const asset0 = assets.find(
    (asset) =>
      asset.tokenInfo.address.toLowerCase() === newToken0.address.toLowerCase(),
  );
  return 10 / Number(asset0?.fiatConversion);
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
  const { assets } = useSafeBalances();

  const form = useForm<typeof ammFormSchema._type>({
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
  const { fallbackState, domainSeparator } = useFallbackState();
  const { sendTransactions } = useRawTxData();
  const [confirmedFallbackSetup, setConfirmedFallbackSetup] = useState(false);

  const token0 = watch("token0");
  const token1 = watch("token1");

  const tokenAddresses = [token0?.address, token1?.address].filter(
    (address) => address,
  ) as Address[];

  const onSubmit = async (data: typeof ammFormSchema._type) => {
    await buildTxAMMArgs({ data, transactionType })
      .then((txArgs) => {
        sendTransactions(txArgs);
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
    setValue("safeAddress", safeAddress);
  }, [safeAddress, setValue]);

  if (!fallbackState || !domainSeparator) {
    return <Spinner />;
  }

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-3 p-9">
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full flex flex-col">
          <TokenSelect
            onSelectToken={(token: IToken) => {
              setValue("token0", {
                decimals: token.decimals,
                address: token.address,
                symbol: token.symbol,
              });
              setValue("minTradedToken0", getNewMinTradeToken0(token, assets));
            }}
            label="Select pair"
            selectedToken={token0 ?? undefined}
          />
          {errors.token0 && (
            <FormMessage className="mt-1 h-6 text-sm text-tomato10">
              <span>{errors.token0.message}</span>
            </FormMessage>
          )}
        </div>
        <div className="w-full flex flex-col">
          <TokenSelect
            onSelectToken={(token: IToken) => {
              setValue("token1", {
                decimals: token.decimals,
                address: token.address,
                symbol: token.symbol,
              });
            }}
            selectedToken={token1 ?? undefined}
          />
          {errors.token1 && (
            <FormMessage className="mt-1 h-6 text-sm text-tomato10">
              <span>{errors.token1.message}</span>
            </FormMessage>
          )}
        </div>
      </div>
      <PriceOracleFields
        form={form}
        chainId={chainId as ChainId}
        tokenAddresses={tokenAddresses}
      />
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="advancedOptions" key="advancedOption">
          <AccordionTrigger
            className={errors.minTradedToken0 ? "text-tomato10" : ""}
          >
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <Input
              label="Minimum first token amount on each order"
              type="number"
              step={10 ** (-token0?.decimals || 18)}
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
          type="submit"
          className="w-full"
          disabled={
            (fallbackState != FALLBACK_STATES.HAS_DOMAIN_VERIFIER &&
              !confirmedFallbackSetup) ||
            isSubmitting
          }
        >
          {isSubmitting ? <Spinner size="sm" /> : <span>Create AMM</span>}
        </Button>
      </div>
    </Form>
  );
}

function PriceOracleFields({
  form,
  chainId,
  tokenAddresses,
}: {
  form: UseFormReturn<typeof ammFormSchema._type>;
  chainId: ChainId;
  tokenAddresses: Address[];
}) {
  const {
    setValue,
    formState: { errors },
    watch,
    register,
  } = form;

  const priceOracle = watch("priceOracle");
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <div className="flex gap-x-2">
          <Label>Price oracle source</Label>
          <Tooltip
            content={
              "The price oracle is what will define the price of the orders the AMM will make."
            }
          >
            <InfoCircledIcon className="w-4 h-4" color={brownDark.brown8} />
          </Tooltip>
        </div>
        <Select
          onValueChange={(priceOracle) => {
            setValue("priceOracle", priceOracle as PRICE_ORACLES);
          }}
          className="w-full mt-2"
          value={priceOracle}
        >
          {Object.values(PRICE_ORACLES).map((value) => (
            <SelectItem value={value} key={value}>
              {value}
            </SelectItem>
          ))}
        </Select>
        {errors.priceOracle && (
          <FormMessage className="h-6 text-sm text-tomato10 w-full">
            <p className="text-wrap">{errors.priceOracle.message as string}</p>
          </FormMessage>
        )}
      </div>
      {priceOracle === PRICE_ORACLES.BALANCER && (
        <div className="flex flex-col gap-y-1">
          <Input
            label="Balancer Pool Id"
            {...register("balancerPoolId")}
            tooltipText="The address of the Balancer pool that will be used as the price oracle. If you click on the load button it will try to find the most liquid pool address using the Balancer subgraph."
          />
          <button
            type="button"
            className="flex flex-row text-blue9 outline-none hover:text-amber9 text-xs"
            onClick={() => {
              getBalancerPoolId(chainId, tokenAddresses)
                .then((id) => {
                  setValue("balancerPoolId", id);
                })
                .catch(() => {
                  setIsNotifierOpen(true);
                });
            }}
          >
            Load from subgraph
          </button>
        </div>
      )}
      {priceOracle === PRICE_ORACLES.UNI && (
        <div className="flex flex-col gap-y-1">
          <Input
            label="Uniswap V2 Pool Address"
            {...register("uniswapV2Pair")}
            tooltipText="The address of the Uniswap V2 pool that will be used as the price oracle. If you click on the load button it will try to find the most liquid pool address using the Uniswap V2 subgraph."
          />
          <button
            type="button"
            className="flex flex-row text-blue9 outline-none hover:text-amber9 text-xs"
            onClick={() => {
              getUniswapV2PairAddress(
                chainId,
                tokenAddresses[0],
                tokenAddresses[1],
              )
                .then((address) => {
                  setValue("uniswapV2Pair", address);
                })
                .catch(() => {
                  setIsNotifierOpen(true);
                });
            }}
          >
            Load from subgraph
          </button>
        </div>
      )}
      <Toast
        content={<ErrorFillingPriceOracleData />}
        isOpen={isNotifierOpen}
        setIsOpen={setIsNotifierOpen}
        duration={5000}
        variant="alert"
      />
    </div>
  );
}

function ErrorFillingPriceOracleData() {
  return (
    <div className="flex h-14 flex-row items-center justify-between px-4 py-8">
      <div className="flex flex-col justify-between space-y-1">
        <h1 className="text-md font-medium text-slate12">Error</h1>
        <h3 className="mb-2 text-sm leading-3 text-slate11">
          Check if tokens are valid and pool exists
        </h3>
      </div>
    </div>
  );
}

async function getBalancerPoolId(chainId: number, tokens: Address[]) {
  if (tokens.length !== 2 || tokens[0] === tokens[1])
    throw new Error("Invalid tokens");

  const poolsData = await pools
    .gql(String(chainId) || "1")
    .weightedPoolsAboveLiquidityWithTokens({
      tokens,
      liquidityThreshold: "1000",
    });

  if (poolsData?.pools.length === 0) throw new Error("Pool not found");

  return poolsData?.pools[0]?.id;
}

async function getUniswapV2PairAddress(
  chainId: number,
  token0: Address,
  token1: Address,
) {
  if (token0 === token1) throw new Error("Invalid tokens");
  const pairsData = await pairs.gql(String(chainId) || "1").pairsWhereTokens({
    token0,
    token1,
    reserveUSDThreshold: "1000",
  });

  if (pairsData?.pairs.length === 0) throw new Error("Pool not found");

  return pairsData?.pairs[0]?.id;
}
