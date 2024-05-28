import useSWR from "swr";
import { Address } from "viem";

import { fetchTokenUsdPrice, fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { ICowAmm, IToken } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

// Constants
const API_URL = "http://localhost:42069";

// GraphQL query for AMM data
const AMM_QUERY = `
query($ammId: String!) {
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
`;

// GraphQL fetch function
export async function gql<T>(
  endpoint: string,
  query: string,
  variables = {},
  headers = {},
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL query failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`GraphQL query failed: ${json.errors[0].message}`);
  }

  return json as T;
}

// Interfaces
interface AmmQueryI {
  data: {
    constantProductData: {
      token0: {
        address: Address;
        decimals: number;
        symbol: string;
      };
      token1: {
        address: Address;
        decimals: number;
        symbol: string;
      };
      minTradedToken0: number;
      priceOracle: Address;
      priceOracleData: `0x${string}`;
      order: {
        handler: Address;
        chainId: ChainId;
      };
      disabled: boolean;
      priceOracleAddress: Address;
    };
  };
}

// Fetch balances from contract
export async function getBalancesFromContract([
  _,
  chainId,
  address,
  token0,
  token1,
]: [string, ChainId, Address, IToken, IToken]) {
  const [token0Balance, token1Balance] = await Promise.all([
    fetchWalletTokenBalance({
      token: token0,
      walletAddress: address,
      chainId,
    }),
    fetchWalletTokenBalance({
      token: token1,
      walletAddress: address,
      chainId,
    }),
  ]);

  return {
    token0: {
      balance: token0Balance,
    },
    token1: {
      balance: token1Balance,
    },
  };
}

// Fetch token external prices
export async function getTokensExternalPrices([_, chainId, token0, token1]: [
  string,
  ChainId,
  IToken,
  IToken,
]) {
  const [token0ExternalUsdPrice, token1ExternalUsdPrice] = await Promise.all([
    fetchTokenUsdPrice({
      tokenAddress: token0.address,
      tokenDecimals: token0.decimals,
      chainId,
    }).catch(() => 0),
    fetchTokenUsdPrice({
      tokenAddress: token1.address,
      tokenDecimals: token1.decimals,
      chainId,
    }).catch(() => 0),
  ]);

  return {
    token0: {
      externalUsdPrice: token0ExternalUsdPrice,
    },
    token1: {
      externalUsdPrice: token1ExternalUsdPrice,
    },
  };
}

// SWR hook to use standalone AMM
export function useStandaloneAMM(ammId: Address) {
  const fetcher = ([url, query, variables]: [
    string,
    string,
    { ammId: string },
  ]) => gql<AmmQueryI>(url, query, variables);

  const {
    data: subgraphData,
    error: subgraphError,
    isLoading: isSubgraphLoading,
    // @ts-expect-error
  } = useSWR<AmmQueryI>([API_URL, AMM_QUERY, { ammId }], fetcher);

  const token0SubgraphData = subgraphData?.data?.constantProductData?.token0;
  const token1SubgraphData = subgraphData?.data?.constantProductData?.token1;
  const chainId = subgraphData?.data?.constantProductData?.order?.chainId;

  const ammAddress = ammId.split("-")[0] as Address;
  const {
    data: balancesData,
    error: balancesError,
    isLoading: isBalancesLoading,
  } = useSWR(
    token0SubgraphData && token1SubgraphData && chainId
      ? [
          "balances",
          chainId,
          ammAddress,
          token0SubgraphData,
          token1SubgraphData,
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
      ? ["prices", chainId, token0SubgraphData, token1SubgraphData]
      : null,
    getTokensExternalPrices,
  );

  if (
    !subgraphData ||
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
      minTradedToken0: subgraphData.data.constantProductData.minTradedToken0,
      disabled: subgraphData.data.constantProductData.disabled,
      priceOracleAddress: subgraphData.data.constantProductData
        .priceOracle as Address,
      priceOracleData: subgraphData.data.constantProductData
        .priceOracleData as `0x${string}`,
    } as ICowAmm,
  };
}
