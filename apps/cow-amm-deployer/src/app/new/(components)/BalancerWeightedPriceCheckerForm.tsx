"use client";

import { Button, toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { UseFormReturn } from "react-hook-form";
import { Address } from "viem";

import { Input } from "#/components/Input";
import { pools } from "#/lib/gqlBalancer";
import { ammFormSchema } from "#/lib/schema";

export function BalancerWeightedPriceCheckerForm({
  form,
}: {
  form: UseFormReturn<typeof ammFormSchema._type>;
}) {
  const { register, setValue, watch } = form;
  const {
    safe: { chainId },
  } = useSafeAppsSDK();

  const token0 = watch("token0");
  const token1 = watch("token1");
  const tokenAddresses = [token0?.address, token1?.address].filter(
    (address) => address,
  ) as Address[];
  return (
    <div className="flex flex-col gap-y-1">
      <Input
        label="Balancer Pool ID"
        {...register("balancerPoolId")}
        tooltipText="The address of the Balancer pool that will be used as the price oracle. Click on the load button it will try to find the most liquid pool address using the Balancer V2's subgraph."
      />
      <Button>Load from subgraph</Button>
      <button
        type="button"
        className="flex flex-row outline-none hover:text-highlight text-xs"
        onClick={async () => {
          try {
            const id = await getBalancerPoolId(chainId, tokenAddresses);
            setValue("balancerPoolId", id);
          } catch (error) {
            toast({
              title: "Pool not found",
              description:
                "None Balancer Weighted Pool was found for the selected tokens.",
              variant: "destructive",
            });
          }
        }}
      >
        Load from subgraph
      </button>
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
