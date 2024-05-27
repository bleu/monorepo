"use client";

import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { UseFormReturn } from "react-hook-form";

import { Input } from "#/components/Input";
import { CHAINS_ORACLE_ROUTER_FACTORY } from "#/lib/chainlinkPriceFeedRouter";
import { ammFormSchema } from "#/lib/schema";
import { ChainId } from "#/utils/chainsPublicClients";

const TOOLTIP_PRICE_FEED_TEXT =
  "The address of the Chainlink price feed that will be used as the price oracle for the second token. Both price feeds have to have the same token as base. Click on the load button to try to find a valid Chainlink price feed pair.";

const TOOLTIP_PRICE_FEED_LINK = "https://data.chain.link/feeds";

export function ChainlinkForm({
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
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full">
          <Input
            {...register("chainlinkPriceFeed0")}
            label="First Token Price Feed"
            tooltipText={TOOLTIP_PRICE_FEED_TEXT}
            tooltipLink={TOOLTIP_PRICE_FEED_LINK}
          />
        </div>
        <div className="w-full">
          <Input
            {...register("chainlinkPriceFeed1")}
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
              // @ts-ignore
              token0,
              // @ts-ignore
              token1,
            });

            const { priceFeedToken0, priceFeedToken1 } =
              await oracleRouter.findRoute();
            setValue("chainlinkPriceFeed0", priceFeedToken0);
            setValue("chainlinkPriceFeed1", priceFeedToken1);
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
        {...register("chainlinkTimeThresholdInHours")}
        type="number"
        label="Maximum time since last price feed update (hours)"
        tooltipText="If the price feed is older than this value, the order will be rejected"
        defaultValue={24}
      />
    </div>
  );
}
