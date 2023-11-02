import { Address, networkFor } from "@bleu-fi/utils";
import * as Sentry from "@sentry/nextjs";
import { zeroAddress } from "viem";

import { ChainName } from "../chainsPublicClients";
import {
    getAPRFromRateProviderInterval,
    getPoolTokensRateProviders,
} from "./rateProviders";

export async function getPoolTokensAprForDateRange(
  chain: string,
  poolId: Address,
  timeStart: number,
  timeEnd: number,
) {
  const rateProviders = await getPoolTokensRateProviders(chain, poolId);
  if (!rateProviders.length) {
    return undefined;
  }
  Sentry.addBreadcrumb({
    category: "getPoolTokensAprForDateRange",
    message: "Pool: " + poolId,
    level: "info",
  });
  Sentry.addBreadcrumb({
    category: "getPoolTokensAprForDateRange",
    message: "Rate providers: " + rateProviders,
    level: "info",
  });

  const chainName = networkFor(chain) as ChainName;
  return await Promise.all(
    rateProviders
      .filter(({ address }) => address !== zeroAddress)
      .map(
        async ({
          address: rateProviderAddress,
          token: { symbol, address: tokenAddress },
        }) => {
          try {
            return {
              address: tokenAddress,
              symbol,
              yield: await getAPRFromRateProviderInterval(
                rateProviderAddress,
                timeStart,
                timeEnd,
                chainName,
                poolId,
                tokenAddress,
              ),
            };
          } catch (error) {
            return {
              address: tokenAddress,
              symbol,
              yield: 0,
            };
          }
        },
      ),
  );
}
