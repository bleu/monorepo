import { graphql } from "gql.tada";
import request from "graphql-request";
import useSWR from "swr";
import { Address } from "viem";

import { NEXT_PUBLIC_API_URL } from "#/lib/ponderApi";
import { ICowAmm, IToken } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

import { getBalancesFromContract } from "./getBalancesFromContract";
import { getTokensExternalPrices } from "./getTokesFrom";

const AMM_QUERY = graphql(`
  query fetchAmmData($ammId: String!) {
    constantProductData(id: $ammId) {
      token0 {
        address
        decimals
        symbol
      }
      token1 {
        address
        decimals
        symbol
      }
      minTradedToken0
      priceOracleData
      priceOracle
      order {
        handler
        chainId
      }
      disabled
    }
  }
`);

export function useStandaloneAMM(ammId: Address) {
  const {
    data: subgraphData,
    error: subgraphError,
    isLoading: isSubgraphLoading,
  } = useSWR(ammId, (ammId) =>
    request(NEXT_PUBLIC_API_URL, AMM_QUERY, { ammId }),
  );

  const token0SubgraphData = subgraphData?.constantProductData?.token0;
  const token1SubgraphData = subgraphData?.constantProductData?.token1;
  const chainId = subgraphData?.constantProductData?.order?.chainId;

  const ammAddress = ammId.split("-")[0] as Address;

  const {
    data: balancesData,
    error: balancesError,
    isLoading: isBalancesLoading,
  } = useSWR(
    token0SubgraphData && token1SubgraphData && chainId
      ? [
          "balances",
          chainId as ChainId,
          ammAddress,
          token0SubgraphData as IToken,
          token1SubgraphData as IToken,
        ]
      : null,
    getBalancesFromContract,
  );

  const {
    data: pricesData,
    error: pricesError,
    isLoading: isPricesLoading,
  } = useSWR(
    token0SubgraphData && token1SubgraphData && chainId
      ? [
          "prices",
          chainId as ChainId,
          token0SubgraphData as IToken,
          token1SubgraphData as IToken,
        ]
      : null,
    getTokensExternalPrices,
  );

  if (
    !subgraphData ||
    !subgraphData.constantProductData ||
    !token0SubgraphData ||
    !token1SubgraphData ||
    !chainId ||
    !balancesData ||
    !pricesData
  ) {
    return {
      loading: true,
      error: subgraphError,
      data: null,
    };
  }

  const token0 = {
    ...token0SubgraphData,
    balance: balancesData.token0.balance,
    usdPrice: pricesData.token0.externalUsdPrice,
    usdValue:
      Number(balancesData.token0.balance) * pricesData.token0.externalUsdPrice,
  };

  const token1 = {
    ...token1SubgraphData,
    balance: balancesData.token1.balance,
    usdPrice: pricesData.token1.externalUsdPrice,
    usdValue:
      Number(balancesData.token1.balance) * pricesData.token1.externalUsdPrice,
  };

  const error = subgraphError || balancesError || pricesError;

  return {
    loading: isSubgraphLoading || isBalancesLoading || isPricesLoading,
    error,
    data: {
      token0,
      token1,
      totalUsdValue: token0.usdValue + token1.usdValue,
      minTradedToken0: subgraphData.constantProductData.minTradedToken0,
      disabled: subgraphData.constantProductData.disabled,
      priceOracleAddress: subgraphData.constantProductData
        .priceOracle as Address,
      priceOracleData: subgraphData.constantProductData
        .priceOracleData as `0x${string}`,
    } as ICowAmm,
  };
}
