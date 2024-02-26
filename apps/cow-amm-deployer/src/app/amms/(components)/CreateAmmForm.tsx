import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { slateDarkA } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Spinner } from "#/components/Spinner";
import { Tooltip } from "#/components/Tooltip";
import { Form, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import { useFallbackState } from "#/hooks/useFallbackState";
import { useRawTxData } from "#/hooks/useRawTxData";
import { createAmmSchema } from "#/lib/schema";
import { createAMMArgs } from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";
import { cowTokenList } from "#/utils/cowTokenList";

import { FALLBACK_STATES, PRICE_ORACLES } from "../../../lib/types";
import { FallbackAndDomainWarning } from "./FallbackAndDomainWarning";
import { IToken, TokenSelect } from "./TokenSelect";

const getDefaultData = (chainId: ChainId) => {
  const token0 = cowTokenList.find(
    (token) => token.chainId === chainId && token.symbol === "WETH",
  );
  const token1 = cowTokenList.find(
    (token) => token.chainId === chainId && token.symbol === "COW",
  );
  return {
    token0,
    token1,
    chainId,
  };
};

export function CreateAmmForm() {
  const {
    safe: { chainId, safeAddress },
  } = useSafeAppsSDK();
  const form = useForm<typeof createAmmSchema._type>({
    resolver: zodResolver(createAmmSchema),
    defaultValues: getDefaultData(chainId as ChainId),
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

  const onSubmit = async (data: typeof createAmmSchema._type) => {
    await createAMMArgs(data).then((txArgs) => {
      sendTransactions(txArgs);
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
            }}
            label="First Token"
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
            label="Second Token"
            selectedToken={token1 ?? undefined}
          />
          {errors.token1 && (
            <FormMessage className="mt-1 h-6 text-sm text-tomato10">
              <span>{errors.token1.message}</span>
            </FormMessage>
          )}
        </div>
      </div>
      <Input
        label="Minimum amount of the first token to be traded on each order"
        type="number"
        step={10 ** -token0.decimals}
        name="minTradedToken0"
      />
      <PriceOracleFields form={form} />
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
}: {
  form: UseFormReturn<typeof createAmmSchema._type>;
}) {
  const {
    setValue,
    formState: { errors },
    watch,
    register,
  } = form;

  const priceOracle = watch("priceOracle");

  return (
    <div className="flex flex-col justify-between gap-y-3">
      <div>
        <div className="flex gap-x-2 items-center">
          <Label>Price checker</Label>
          <Tooltip
            content={
              "The price oracle is what will define the price of the orders the AMM will make."
            }
          >
            <InfoCircledIcon className="w-4 h-4" color={slateDarkA.slateA11} />
          </Tooltip>
        </div>
        <Select
          onValueChange={(priceOracle) => {
            setValue("priceOracle", priceOracle as PRICE_ORACLES);
          }}
          className="w-full mt-2"
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
        <Input label="Balancer Pool Id" {...register("balancerPoolId")} />
      )}
      {priceOracle === PRICE_ORACLES.UNI && (
        <Input label="Uniswap V2 Pool Address" {...register("uniswapV2Pair")} />
      )}
    </div>
  );
}
