import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Address } from "viem";
import { z } from "zod";

import { Input } from "#/components/Input";
import { pairs } from "#/lib/gqlSushi";
import { ammEditSchema, ammFormSchema } from "#/lib/schema";
import { loadDEXPriceCheckerErrorText } from "#/lib/utils";

export function SushiForm({
  form,
}: {
  form: UseFormReturn<
    z.input<typeof ammFormSchema> | z.input<typeof ammEditSchema>
  >;
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
        label="Sushi V2 Pair Address"
        {...register("priceOracleSchema.pairAddress")}
        tooltipText="The address of the Sushi V2 pair that will be used as the price oracle. Click on the load button it will try to find the most liquid pair address using the Sushi V2's subgraph."
      />
      <button
        type="button"
        className="flex flex-row outline-none hover:text-highlight text-xs"
        onClick={() => {
          getSushiV2PairAddress(chainId, tokenAddresses[0], tokenAddresses[1])
            .then((address) => {
              setValue("priceOracleSchema.pairAddress", address);
            })
            .catch(() => {
              toast({
                title: "Pair not found",
                description: loadDEXPriceCheckerErrorText("Sushi V2"),
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

async function getSushiV2PairAddress(
  chainId: number,
  token0: Address,
  token1: Address
) {
  if (token0 === token1) throw new Error("Invalid tokens");
  const pairsData = await pairs.gql(String(chainId)).pairsWhereTokens({
    token0: token0.toLowerCase(),
    token1: token1.toLowerCase(),
    reserveUSDThreshold: "1000",
  });

  if (pairsData?.pairs.length === 0) throw new Error("Pool not found");

  return pairsData?.pairs[0]?.id;
}
