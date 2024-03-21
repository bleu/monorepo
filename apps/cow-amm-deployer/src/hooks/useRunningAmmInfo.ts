import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import { Address, decodeAbiParameters, formatUnits } from "viem";

import { composableCowAbi } from "#/lib/abis/composableCow";
import { cowAmmModuleAbi } from "#/lib/abis/cowAmmModule";
import {
  COMPOSABLE_COW_ADDRESS,
  COW_AMM_HANDLER_ADDRESS,
  COW_AMM_MODULE_ADDRESS,
} from "#/lib/contracts";
import { fetchTokenUsdPrice } from "#/lib/fetchTokenUsdPrice";
import { UserCurrentAmmQuery } from "#/lib/gqlComposableCow/generated";
import { composableCowApi } from "#/lib/gqlComposableCow/sdk";
import { ICowAmm, PRICE_ORACLES, PriceOracleData } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { useSafeBalances } from "./useSafeBalances";

gql(`
query UserCurrentAmm($userId: String!, $handlerId: String!) {
  orders(
    where: {userId: $userId, orderHandlerId: $handlerId}
    limit: 1
    orderBy: "blockNumber"
    orderDirection: "desc"
  ) {
    items {
      id
      chainId
      blockNumber
      blockTimestamp
      hash
      orderHandlerId
      decodedSuccess
      staticInput
      constantProductData {
        id
        token0 {
          id
          address
          symbol
          decimals
        }
        token1 {
          id
          address
          symbol
          decimals
        }
        minTradedToken0
        priceOracle
        priceOracleData
        appData
      }
    }
  }
}
`);

export async function fetchLastAmmInfo({
  chainId,
  safeAddress,
}: {
  safeAddress: Address;
  chainId: ChainId;
}) {
  const { orders } = await composableCowApi.UserCurrentAmm({
    userId: `${safeAddress}-${chainId}`,
    handlerId: `${COW_AMM_HANDLER_ADDRESS[chainId as ChainId]}-${chainId}`,
  });

  const order = orders?.items?.[0];
  if (!order || !order.decodedSuccess) return;

  return decodePriceOracle({
    constantProductData: order.constantProductData,
    hash: order.hash as `0x${string}`,
  });
}
export const ADDRESSES_PRICE_ORACLES = {
  "0xad37fe3ddedf8cdee1022da1b17412cfb6495596": PRICE_ORACLES.BALANCER,
  "0x573cc0c800048f94e022463b9214d92c2d65e97b": PRICE_ORACLES.UNI,
  "0xd3a84895080609e1163c80b2bd65736db1b86bec": PRICE_ORACLES.BALANCER,
  "0xe089049027b95c2745d1a954bc1d245352d884e9": PRICE_ORACLES.UNI,
  "0xb2efb68ab1798c04700afd7f625c0ffbde974756": PRICE_ORACLES.BALANCER,
  "0xe45ae383873f9f7e3e42deb12886f481999696b6": PRICE_ORACLES.UNI,
} as const;

export async function decodePriceOracle({
  constantProductData,
  hash,
}: {
  // @ts-ignore
  constantProductData: UserCurrentAmmQuery["orders"]["items"][0]["constantProductData"];
  hash: `0x${string}`;
}) {
  const priceOracle =
    ADDRESSES_PRICE_ORACLES[
      constantProductData?.priceOracle.toLowerCase() as keyof typeof ADDRESSES_PRICE_ORACLES
    ];
  const priceOracleDataDecoded = decodePriceOracleData({
    priceOracle,
    priceOracleData: constantProductData?.priceOracleData as `0x${string}`,
  });

  return {
    ...constantProductData,
    hash: hash,
    priceOracleType: priceOracle,
    priceOracleDataDecoded,
  };
}

export function decodePriceOracleData({
  priceOracle,
  priceOracleData,
}: {
  priceOracle: PRICE_ORACLES;
  priceOracleData: `0x${string}`;
}): PriceOracleData {
  if (priceOracle === PRICE_ORACLES.BALANCER) {
    const [balancerPoolId] = decodeAbiParameters(
      [{ type: "bytes32", name: "poolId" }],
      priceOracleData,
    );
    return { balancerPoolId: balancerPoolId as `0x${string}` };
  }
  if (priceOracle === PRICE_ORACLES.UNI) {
    const [uniswapV2PairAddress] = decodeAbiParameters(
      [{ type: "address", name: "pairAddress" }],
      priceOracleData,
    );
    return { uniswapV2PairAddress };
  }
  throw new Error("Unknown price oracle");
}

export async function checkIsAmmRunning(
  chainId: ChainId,
  safeAddress: Address,
  orderHash: `0x${string}`,
) {
  const publicClient = publicClientsFromIds[chainId];
  return publicClient.readContract({
    address: COMPOSABLE_COW_ADDRESS,
    abi: composableCowAbi,
    functionName: "singleOrders",
    args: [safeAddress, orderHash],
  });
}

export async function checkAmmIsFromModule(
  chainId: ChainId,
  safeAddress: Address,
  orderHash: `0x${string}`,
): Promise<boolean> {
  const publicClient = publicClientsFromIds[chainId];
  return publicClient
    .readContract({
      address: COW_AMM_MODULE_ADDRESS[chainId],
      abi: cowAmmModuleAbi,
      functionName: "activeOrders",
      args: [safeAddress],
    })
    .then((result) => result.toLowerCase() === orderHash.toLowerCase());
}

export function useRunningAMM(): {
  cowAmm?: ICowAmm;
  loaded: boolean;
  isAmmRunning: boolean;
  error: boolean;
  updateAmmInfo: () => Promise<void>;
  isAmmFromModule: boolean;
} {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();

  const [cowAmm, setCowAmm] = useState<ICowAmm>();
  const [isAmmRunning, setIsAmmRunning] = useState<boolean>(false);
  const [isAmmFromModule, setIsAmmFromModule] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { assets, loaded: assetLoaded } = useSafeBalances();

  async function loadCoWAmmRunning(hash: `0x${string}`) {
    const [newIsAmmRunning, newIsAmmFromModule] = await Promise.all([
      checkIsAmmRunning(chainId as ChainId, safeAddress as Address, hash),
      checkAmmIsFromModule(chainId as ChainId, safeAddress as Address, hash),
    ]);
    setIsAmmRunning(newIsAmmRunning);
    setIsAmmFromModule(newIsAmmFromModule);
  }

  async function loadCowAmm() {
    const gqlInfo = await fetchLastAmmInfo({
      chainId: chainId as ChainId,
      safeAddress: safeAddress as Address,
    });

    const token0 = assets.find(
      (asset) =>
        asset.tokenInfo.address.toLowerCase() ===
        gqlInfo?.token0?.address.toLowerCase(),
    );
    const token1 = assets.find(
      (asset) =>
        asset.tokenInfo.address.toLowerCase() ===
        gqlInfo?.token1?.address.toLowerCase(),
    );

    if (!token0 || !token1) {
      return;
    }

    const [token0ExternalUsdPrice, token1ExternalUsdPrice] = await Promise.all([
      fetchTokenUsdPrice({
        tokenAddress: token0.tokenInfo.address as Address,
        tokenDecimals: token0.tokenInfo.decimals,
        chainId: chainId as ChainId,
      }).catch(() => 0),
      fetchTokenUsdPrice({
        tokenAddress: token1.tokenInfo.address as Address,
        tokenDecimals: token1.tokenInfo.decimals,
        chainId: chainId as ChainId,
      }).catch(() => 0),
    ]);

    const [token0ExternalUsdValue, token1ExternalUsdValue] = [
      token0ExternalUsdPrice *
        Number(formatUnits(BigInt(token0.balance), token0.tokenInfo.decimals)),
      token1ExternalUsdPrice *
        Number(formatUnits(BigInt(token1.balance), token1.tokenInfo.decimals)),
    ];

    const totalUsdValue = token0ExternalUsdValue + token1ExternalUsdValue;

    return {
      token0: {
        ...token0,
        externalUsdPrice: token0ExternalUsdPrice,
        externalUsdValue: token0ExternalUsdValue,
      },
      hash: gqlInfo?.hash as `0x${string}`,
      token1: {
        ...token1,
        externalUsdPrice: token1ExternalUsdPrice,
        externalUsdValue: token1ExternalUsdValue,
      },
      totalUsdValue,
      minTradedToken0: gqlInfo?.minTradedToken0 as number,
      priceOracle: gqlInfo?.priceOracleType as PRICE_ORACLES,
      priceOracleData: gqlInfo?.priceOracleDataDecoded as PriceOracleData,
    };
  }

  async function updateAmmInfo(): Promise<void> {
    setError(false);
    await loadCowAmm()
      .then(async (newCowAmm) => {
        if (!newCowAmm) return;
        setCowAmm(newCowAmm);
        await loadCoWAmmRunning(newCowAmm.hash);
      })
      .catch(() => {
        setError(true);
      });
    setLoaded(true);
  }

  useEffect(() => {
    if (!assetLoaded) return;
    updateAmmInfo();
  }, [safeAddress, chainId, assets]);

  return {
    cowAmm,
    loaded,
    isAmmRunning,
    error,
    updateAmmInfo,
    isAmmFromModule,
  };
}
