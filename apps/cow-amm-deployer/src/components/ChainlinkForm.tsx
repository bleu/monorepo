"use client";

import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import { Input } from "#/components/Input";
import { CHAINS_ORACLE_ROUTER_FACTORY } from "#/lib/chainlinkPriceFeedRouter";
import { IToken } from "#/lib/fetchAmmData";
import { ammEditSchema, ammFormSchema } from "#/lib/schema";
import { ChainId } from "#/utils/chainsPublicClients";

const TOOLTIP_PRICE_FEED_TEXT =
  "The address of the Chainlink price feed that will be used as the price oracle for the second token. Both price feeds have to have the same token as base. Click on the load button to try to find a valid Chainlink price feed pair.";

const TOOLTIP_PRICE_FEED_LINK = "https://data.chain.link/feeds";

export function ChainlinkForm({
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

  const token0 = useWatch({ control, name: "token0" }) as IToken;
  const token1 = useWatch({ control, name: "token1" }) as IToken;
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full">
          <Input
            {...register("priceOracleSchema.feed0")}
            label="First Token Price Feed"
            tooltipText={TOOLTIP_PRICE_FEED_TEXT}
            tooltipLink={TOOLTIP_PRICE_FEED_LINK}
          />
        </div>
        <div className="w-full">
          <Input
            {...register("priceOracleSchema.feed1")}
            label="Second Token Price Feed"
            tooltipText={TOOLTIP_PRICE_FEED_TEXT}
            tooltipLink={TOOLTIP_PRICE_FEED_LINK}
          />
        </div>
      </div>
      <button
        type="button"
        className="flex flex-row outline-none hover:text-highlight text-xs my-1"
        onClick={async () => {
          try {
            const oracleRouterFactory =
              CHAINS_ORACLE_ROUTER_FACTORY[chainId as ChainId];
            const oracleRouter = new oracleRouterFactory({
              chainId: chainId as ChainId,

              token0,

              token1,
            });

            const { priceFeedToken0, priceFeedToken1 } =
              await oracleRouter.findRoute();
            setValue("priceOracleSchema.feed0", priceFeedToken0);
            setValue("priceOracleSchema.feed1", priceFeedToken1);
          } catch (e) {
            toast({
              title: "Price feed not found",
              description:
                "No Chainlink price feed pair found for these tokens",
              variant: "destructive",
            });
          }
        }}
      >
        Load Chainlink Price Feeds
      </button>
      <Input
        {...register("priceOracleSchema.timeThresholdInHours")}
        type="number"
        label="Maximum time since last price feed update (hours)"
        tooltipText="If the price feed is older than this value, the order will be rejected"
        defaultValue={24}
      />
    </div>
  );
}
