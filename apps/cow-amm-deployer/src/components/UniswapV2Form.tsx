import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Address } from "viem";

import { Input } from "#/components/Input";
import { pairs } from "#/lib/gqlUniswapV2";
import { loadDEXPriceCheckerErrorText } from "#/lib/utils";

export function UniswapV2Form({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}) {
  const { register, setValue, control } = form;
  const {
    safe: { chainId },
  } = useSafeAppsSDK();

  const [token0, token1] = useWatch({ control, name: ["token0", "token1"] });
  const tokenAddresses = [token0?.address, token1?.address].filter(
    (address) => address
  ) as Address[];
  return (
    <div className="flex flex-col gap-y-1">
      <Input
        label="Uniswap V2 Pair Address"
        {...register("uniswapV2Pair")}
        tooltipText="The address of the Uniswap V2 pair that will be used as the price oracle. Click on the load button it will try to find the most liquid pair address using the Uniswap V2's subgraph."
      />
      <button
        type="button"
        className="flex flex-row outline-none hover:text-highlight text-xs"
        onClick={async () => {
          try {
            const address = await getUniswapV2PairAddress(
              chainId,
              tokenAddresses[0],
              tokenAddresses[1]
            );
            setValue("uniswapV2Pair", address);
          } catch (error) {
            toast({
              title: "Pool not found",
              description: loadDEXPriceCheckerErrorText("Sushi V2"),
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

async function getUniswapV2PairAddress(
  chainId: number,
  token0: Address,
  token1: Address
) {
  if (token0 === token1) throw new Error("Invalid tokens");
  const pairsData = await pairs.gql(String(chainId) || "1").pairsWhereTokens({
    token0: token0.toLowerCase(),
    token1: token1.toLowerCase(),
    reserveUSDThreshold: "1000",
  });

  if (pairsData?.pairs.length === 0) throw new Error("Pair not found");

  return pairsData?.pairs[0]?.id;
}
