import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { slateDarkA } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Tooltip } from "#/components/Tooltip";
import { Form, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import { createAmmSchema } from "#/lib/schema";
import { ChainId } from "#/utils/chainsPublicClients";
import { cowTokenList } from "#/utils/cowTokenList";

import { PRICE_ORACLES } from "../utils/type";
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
  };
};

export function CreateAmmForm() {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();
  const form = useForm<typeof createAmmSchema._type>({
    resolver: zodResolver(createAmmSchema),
    defaultValues: getDefaultData(chainId as ChainId),
  });

  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const token0 = watch("token0");
  const token1 = watch("token1");

  const onSubmit = (data: FieldValues) => {
    // TODO: Implement this
    // eslint-disable-next-line no-console
    console.log("submit", data);
  };

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <div>
        <div className="flex flex-col h-fit justify-between gap-y-7">
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
                tokenType="sell"
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
                tokenType="sell"
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
            label="Minimum traded first token"
            type="number"
            step={10 ** -token0.decimals}
            name="minTradedToken0"
          />
          <PriceOracleFields form={form} />
          <div className="flex justify-center gap-x-5">
            <Button type="submit" className="w-full">
              <span>Create AMM</span>
            </Button>
          </div>
        </div>
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
    <div className="flex flex-col justify-between gap-y-7">
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
        <Input label="Uniswap V2 Pool Id" {...register("uniswapV2Pair")} />
      )}
    </div>
  );
}
