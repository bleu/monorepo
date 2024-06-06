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

import {
  decodePriceOracleWithData,
  PriceOracleData,
} from "#/lib/decodePriceOracle";
import { NEXT_PUBLIC_API_URL } from "#/lib/ponderApi";
import { PRICE_ORACLES } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { composableCowAbi } from "./abis/composableCow";
import { priceFeedAbi } from "./abis/priceFeed";
import { COMPOSABLE_COW_ADDRESS } from "./contracts";
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
      version
      order {
        handler
        chainId
        owner
        hash
        blockTimestamp
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
    constantProductDatas(where: { userId: $userId }) {
      items {
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
        version
        order {
          handler
          chainId
          owner
          hash
          blockTimestamp
        }
        disabled
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

export type ICoWAMMSubgraph = ResultOf<typeof AMM_QUERY>["constantProductData"];

export type ICowAmm = ICoWAMMSubgraph & {
  priceOracleData: `0x${string}`;
  priceOracle: Address;
  token0: ITokenExtended;
  token1: ITokenExtended;
  decodedPriceOracleData: PriceOracleData;
  totalUsdValue: number;
  chainId: ChainId;
  priceFeedLinks: string[];
  minTradedToken0: bigint;
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
  decodedData: PriceOracleData
): Promise<string[]> {
  switch (decodedData.priceOracle) {
    case PRICE_ORACLES.UNI: {
      const url = getUniV2PairUrl(decodedData.chainId, decodedData.pairAddress);
      return url ? [url] : [];
    }
    case PRICE_ORACLES.BALANCER:
      return [getBalancerPoolUrl(decodedData.chainId, decodedData.poolId)];
    case PRICE_ORACLES.SUSHI:
      return [getSushiV2Pair(decodedData.chainId, decodedData.pairAddress)];
    case PRICE_ORACLES.CHAINLINK: {
      const [feed0Link, feed1Link] = await Promise.all([
        getPriceFeedLink(decodedData.chainId, decodedData.feed0 as Address),
        getPriceFeedLink(decodedData.chainId, decodedData.feed1 as Address),
      ]);
      return [feed0Link, feed1Link].filter(Boolean) as string[];
    }
    case PRICE_ORACLES.CUSTOM: {
      const url = buildBlockExplorerAddressURL({
        chainId: decodedData.chainId,
        address: decodedData.address as Address,
      });
      return url ? [url.url] : [];
    }
  }
}

async function checkSafeModuleIsDisabled({
  chainId,
  version,
  disabledApiData,
  hash,
  owner,
}: {
  chainId: ChainId;
  version: string;
  disabledApiData: boolean | null;
  hash: `0x${string}`;
  owner: Address;
}): Promise<boolean> {
  // Standalone disable can be checked on the API
  // however, for the safe module version, we need on the composable cow contract
  if (version === "Standalone") {
    return !!disabledApiData;
  }
  const publicClient = publicClientsFromIds[chainId];
  const enabled = await publicClient.readContract({
    address: COMPOSABLE_COW_ADDRESS,
    abi: composableCowAbi,
    functionName: "singleOrders",
    args: [owner, hash],
  });
  return !enabled;
}

export const getAmmData = cache(
  async (subgraphData: ICoWAMMSubgraph): Promise<ICowAmm> => {
    if (!subgraphData || !subgraphData) {
      throw new Error("Failed to fetch AMM data");
    }

    const token0SubgraphData = subgraphData.token0;
    const token1SubgraphData = subgraphData.token1;

    const [balancesData, pricesData, decodedPriceOracleData, disabled] =
      await Promise.all([
        getBalancesFromContract([
          "balances",
          subgraphData.order.chainId as ChainId,
          subgraphData.order.owner as Address,
          token0SubgraphData as IToken,
          token1SubgraphData as IToken,
        ]),
        getTokensExternalPrices([
          "prices",
          subgraphData.order.chainId as ChainId,
          token0SubgraphData as IToken,
          token1SubgraphData as IToken,
        ]),
        decodePriceOracleWithData({
          address: subgraphData.priceOracle as Address,
          priceOracleData: subgraphData.priceOracleData as Address,
          chainId: subgraphData.order.chainId as ChainId,
        }),
        checkSafeModuleIsDisabled({
          chainId: subgraphData.order.chainId as ChainId,
          version: subgraphData.version,
          disabledApiData: subgraphData.disabled,
          hash: subgraphData.order.hash as `0x${string}`,
          owner: subgraphData.order.owner as Address,
        }),
      ]);

    const priceFeedLinks = await fetchPriceFeedLinks(decodedPriceOracleData);

    const token0 = {
      ...token0SubgraphData,
      balance: balancesData.token0.balance,
      usdPrice: pricesData.token0.externalUsdPrice,
      usdValue:
        Number(balancesData.token0.balance) *
        pricesData.token0.externalUsdPrice,
    };

    const token1 = {
      ...token1SubgraphData,
      balance: balancesData.token1.balance,
      usdPrice: pricesData.token1.externalUsdPrice,
      usdValue:
        Number(balancesData.token1.balance) *
        pricesData.token1.externalUsdPrice,
    };

    return {
      ...subgraphData,
      disabled,
      token0,
      token1,
      totalUsdValue: token0.usdValue + token1.usdValue,
      decodedPriceOracleData,
      chainId: subgraphData.order.chainId,
      priceFeedLinks,
    } as ICowAmm;
  }
);

export const fetchAmmData = cache(async (ammId: string): Promise<ICowAmm> => {
  const subgraphData = await request(NEXT_PUBLIC_API_URL, AMM_QUERY, { ammId });
  if (!subgraphData || !subgraphData) {
    throw new Error("Failed to fetch AMM data");
  }

  return getAmmData(subgraphData.constantProductData);
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

export const fetchUserAmmsData = cache(
  async (userId: string): Promise<ICowAmm[]> => {
    const { constantProductDatas } = await request(
      NEXT_PUBLIC_API_URL,
      ALL_STANDALONE_AMMS_FROM_USER_QUERY,
      { userId }
    );

    const allAmms = (await Promise.all(
      constantProductDatas.items.map((amm) => getAmmData(amm))
    )) as ICowAmm[];

    return allAmms.filter(
      (amm) => amm.version === "Standalone" || !amm.disabled
    );
  }
);
