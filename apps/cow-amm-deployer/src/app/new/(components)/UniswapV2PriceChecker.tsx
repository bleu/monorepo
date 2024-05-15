import { toast } from "@bleu-fi/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { UseFormReturn } from "react-hook-form";
import { Address } from "viem";

import { Input } from "#/components/Input";
import { pairs } from "#/lib/gqlUniswapV2";
import { ammFormSchema } from "#/lib/schema";

export function UniswapV2PriceChecker({
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
        label="Uniswap V2 Pool Address"
        {...register("uniswapV2Pair")}
        tooltipText="The address of the Uniswap V2 pool that will be used as the price oracle. If you click on the load button it will try to find the most liquid pool address using the Uniswap V2 subgraph."
      />
      <button
        type="button"
        className="flex flex-row outline-none hover:text-highlight text-xs"
        onClick={() => {
          getUniswapV2PairAddress(chainId, tokenAddresses[0], tokenAddresses[1])
            .then((address) => {
              setValue("uniswapV2Pair", address);
            })
            .catch(() => {
              toast({
                title: "Pool not found",
                description:
                  "None Uniswap V2 Pair was found for the selected tokens.",
                variant: "destructive",
              });
            });
        }}
      >
        Load from subgraph
      </button>
    </div>
  );
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
