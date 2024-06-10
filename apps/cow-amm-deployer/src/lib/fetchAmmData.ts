import {
  buildBlockExplorerAddressURL,
  NetworkFromNetworkChainId,
} from "@bleu/utils";
import { graphql, ResultOf } from "gql.tada";
import request from "graphql-request";
// @ts-expect-error
import { cache } from "react";
import { Address } from "viem";
import { gnosis, sepolia } from "viem/chains";

import { decodePriceOracleWithData } from "#/lib/decodePriceOracle";
import { NEXT_PUBLIC_API_URL } from "#/lib/ponderApi";
import { PRICE_ORACLES, PriceOracleData, PriceOraclesValue } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { priceFeedAbi } from "./abis/priceFeed";
import { getBalancesFromContract } from "./getBalancesFromContract";
import { getTokensExternalPrices } from "./getTokensExternalPrices";

export const AMM_QUERY = graphql(`
  query fetchAmmData($ammId: String!) {
    constantProductData(id: $ammId) {
      id
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
        owner
      }
      disabled
      user {
        id
        address
      }
    }
  }
`);

export const ALL_STANDALONE_AMMS_FROM_USER_QUERY = graphql(`
  query ($userId: String!) {
    constantProductDatas(where: { userId: $userId, version: "Standalone" }) {
      items {
        id
        disabled
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
        order {
          blockTimestamp
          chainId
          owner
        }
        user {
          id
          address
        }
      }
    }
  }
`);

export type IToken = NonNullable<
  ResultOf<typeof AMM_QUERY>["constantProductData"]
>["token0"];

export interface ITokenExtended extends IToken {
  balance: string;
  usdPrice: number;
  usdValue: number;
}

export type ICowAmm = ResultOf<typeof AMM_QUERY>["constantProductData"] & {
  priceOracleData: `0x${string}`;
  priceOracle: Address;
  token0: ITokenExtended;
  token1: ITokenExtended;
  decodedPriceOracleData: [PriceOraclesValue, PriceOracleData];
  totalUsdValue: number;
  chainId: ChainId;
  priceFeedLinks: string[];
  minTradedToken0: bigint;
};

export type ICoWAmmOverview = ResultOf<
  typeof ALL_STANDALONE_AMMS_FROM_USER_QUERY
>["constantProductDatas"]["items"][0] & {
  totalUsdValue: number;
  token0: ITokenExtended;
  token1: ITokenExtended;
};

export function validateAmmId(id: string) {
  const parts = id.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid AMM id");
  }

  return [
    parts[0] as Address,
    parts[1] as Address,
    parseInt(parts[2]) as ChainId,
  ] as const;
}

async function fetchPriceFeedLinks(
  decodedData: [PriceOraclesValue, PriceOracleData],
  chainId: ChainId,
): Promise<string[]> {
  switch (decodedData[0]) {
    case PRICE_ORACLES.UNI: {
      const url = getUniV2PairUrl(chainId, decodedData[1].uniswapV2PairAddress);
      return url ? [url] : [];
      return [];
    }
    case PRICE_ORACLES.BALANCER:
      return [getBalancerPoolUrl(chainId, decodedData[1].balancerPoolId)];
    case PRICE_ORACLES.SUSHI:
      return [getSushiV2Pair(chainId, decodedData[1].sushiSwapPairAddress)];
    case PRICE_ORACLES.CHAINLINK: {
      const [feed0Link, feed1Link] = await Promise.all([
        getPriceFeedLink(chainId, decodedData[1].chainlinkPriceFeed0),
        getPriceFeedLink(chainId, decodedData[1].chainlinkPriceFeed1),
      ]);
      return [feed0Link, feed1Link].filter(Boolean) as string[];
    }
    default: {
      const url = buildBlockExplorerAddressURL({
        chainId,
        address: decodedData[1].customPriceOracleAddress,
      });
      return url ? [url.url] : [];
    }
  }
}

export const fetchAmmData = cache(async (ammId: string): Promise<ICowAmm> => {
  const [ammAddress, _, chainId] = validateAmmId(ammId);

  const subgraphData = await request(NEXT_PUBLIC_API_URL, AMM_QUERY, { ammId });
  if (!subgraphData || !subgraphData.constantProductData) {
    throw new Error("Failed to fetch AMM data");
  }

  const token0SubgraphData = subgraphData.constantProductData.token0;
  const token1SubgraphData = subgraphData.constantProductData.token1;

  const [balancesData, pricesData, decodedPriceOracleData] = await Promise.all([
    getBalancesFromContract([
      "balances",
      chainId as ChainId,
      ammAddress,
      token0SubgraphData as IToken,
      token1SubgraphData as IToken,
    ]),
    getTokensExternalPrices([
      "prices",
      chainId as ChainId,
      token0SubgraphData as IToken,
      token1SubgraphData as IToken,
    ]),
    decodePriceOracleWithData({
      address: subgraphData.constantProductData.priceOracle as Address,
      priceOracleData: subgraphData.constantProductData
        .priceOracleData as Address,
      chainId: chainId as ChainId,
    }),
  ]);

  const priceFeedLinks = await fetchPriceFeedLinks(
    decodedPriceOracleData,
    chainId,
  );

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

  return {
    ...subgraphData.constantProductData,
    token0,
    token1,
    totalUsdValue: token0.usdValue + token1.usdValue,
    decodedPriceOracleData,
    chainId,
    priceFeedLinks,
  } as ICowAmm;
});

export function getUniV2PairUrl(chainId: ChainId, referencePair?: string) {
  if (chainId === gnosis.id) {
    return;
  }

  return `https://info.uniswap.org/#/${NetworkFromNetworkChainId[chainId]}/pools/${referencePair}`;
}

export function getSushiV2Pair(chainId: ChainId, referencePair?: string) {
  return `https://www.sushi.com/pool/${[chainId]}%3A${referencePair}`;
}

export function getBalancerPoolUrl(chainId: ChainId, poolId?: string) {
  return `https://app.balancer.fi/#/${NetworkFromNetworkChainId[chainId]}-chain/pool/${poolId}`;
}

async function getPriceFeedLink(chainId: ChainId, address?: Address) {
  if (!address) return;
  if (chainId === sepolia.id) return;
  const publicClient = publicClientsFromIds[chainId];
  const priceFeedDescription = (await publicClient.readContract({
    address: address,
    abi: priceFeedAbi,
    functionName: "description",
  })) as string;
  const priceFeedPageName = priceFeedDescription
    .replace(" / ", "-")
    .toLowerCase();
  const chainName = chainId === gnosis.id ? "xdai" : "ethereum";

  return `https://data.chain.link/feeds/${chainName}/mainnet/${priceFeedPageName}`;
}

export const fetchAllStandAloneAmmsFromUser = cache(
  async (userId: string): Promise<ICoWAmmOverview[]> => {
    const { constantProductDatas } = await request(
      NEXT_PUBLIC_API_URL,
      ALL_STANDALONE_AMMS_FROM_USER_QUERY,
      { userId },
    );

    if (!constantProductDatas || !constantProductDatas.items) {
      throw new Error("Failed to fetch AMMs");
    }

    const [balancesData, pricesData] = await Promise.all([
      Promise.all(
        constantProductDatas.items.map((amm) =>
          getBalancesFromContract([
            "balances",
            amm.order.chainId as ChainId,
            amm.order.owner as Address,
            amm.token0 as IToken,
            amm.token1 as IToken,
          ]),
        ),
      ),
      Promise.all(
        constantProductDatas.items.map((amm) =>
          getTokensExternalPrices([
            "prices",
            amm.order.chainId as ChainId,
            amm.token0 as IToken,
            amm.token1 as IToken,
          ]),
        ),
      ),
    ]);

    return constantProductDatas.items.map((amm, index) => {
      const token0 = {
        ...amm.token0,
        balance: balancesData[index].token0.balance,
        usdPrice: pricesData[index].token0.externalUsdPrice,
        usdValue:
          Number(balancesData[index].token0.balance) *
          pricesData[index].token0.externalUsdPrice,
      };

      const token1 = {
        ...amm.token1,
        balance: balancesData[index].token1.balance,
        usdPrice: pricesData[index].token1.externalUsdPrice,
        usdValue:
          Number(balancesData[index].token1.balance) *
          pricesData[index].token1.externalUsdPrice,
      };

      return {
        ...amm,
        token0,
        token1,
        totalUsdValue: token0.usdValue + token1.usdValue,
      } as ICoWAmmOverview;
    });
  },
);
