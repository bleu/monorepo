import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import { Address, decodeAbiParameters } from "viem";

import { cowAmmModuleAbi } from "#/lib/abis/cowAmmModule";
import {
  COW_AMM_HANDLER_ADDRESS,
  COW_AMM_MODULE_ADDRESS,
} from "#/lib/contracts";
import { UserCurrentAmmQuery } from "#/lib/gql/generated";
import { composableCowApi } from "#/lib/gql/sdk";
import { ICowAmm, PRICE_ORACLES, PriceOracleData } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { useSafeBalances } from "./useSafeBalances";

gql(`
  query UserCurrentAmm($userId: String!, $handler: String!) {
  orders(
    where: {user: $userId, handler: $handler}
    limit: 1
    orderBy: "blockNumber"
    orderDirection: "asc"
  ) {
    items {
      id
      chainId
      blockNumber
      blockTimestamp
      handler
      decodedSuccess
      staticInput
      cowAmmParameters {
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

const NULL_ACTIVE_ORDER =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export async function fetchLastAmmInfo({
  chainId,
  safeAddress,
}: {
  safeAddress: Address;
  chainId: ChainId;
}) {
  const { orders } = await composableCowApi.UserCurrentAmm({
    userId: `${safeAddress}-${chainId}`,
    handler: COW_AMM_HANDLER_ADDRESS[chainId as ChainId],
  });

  const order = orders.items[0];
  if (!order || !order.decodedSuccess) return;

  return decodePriceOracle({ cowAmmParameters: order.cowAmmParameters });
}

export const ADDRESSES_PRICE_ORACLES = {
  // TODO: COW-161 Add mainnet addresses
  "0xd3a84895080609e1163c80b2bd65736db1b86bec": PRICE_ORACLES.BALANCER,
  "0xe089049027b95c2745d1a954bc1d245352d884e9": PRICE_ORACLES.UNI,
} as const;

export async function decodePriceOracle({
  cowAmmParameters,
}: {
  cowAmmParameters: UserCurrentAmmQuery["orders"]["items"][0]["cowAmmParameters"];
}) {
  const priceOracle =
    ADDRESSES_PRICE_ORACLES[
      cowAmmParameters?.priceOracle.toLowerCase() as keyof typeof ADDRESSES_PRICE_ORACLES
    ];
  const priceOracleDataDecoded = decodePriceOracleData({
    priceOracle,
    priceOracleData: cowAmmParameters?.priceOracleData as `0x${string}`,
  });

  return {
    ...cowAmmParameters,
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
      priceOracleData
    );
    return { balancerPoolId: balancerPoolId as `0x${string}` };
  }
  if (priceOracle === PRICE_ORACLES.UNI) {
    const [uniswapV2PairAddress] = decodeAbiParameters(
      [{ type: "address", name: "pairAddress" }],
      priceOracleData
    );
    return { uniswapV2PairAddress };
  }
  throw new Error("Unknown price oracle");
}

export async function checkAmmRunning(chainId: ChainId, safeAddress: Address) {
  const publicClient = publicClientsFromIds[chainId];
  return publicClient
    .readContract({
      address: COW_AMM_MODULE_ADDRESS,
      abi: cowAmmModuleAbi,
      functionName: "activeOrders",
      args: [safeAddress],
    })
    .then((activeOrder) => {
      return activeOrder != NULL_ACTIVE_ORDER;
    });
}

export function useRunningAMM(): {
  cowAmm?: ICowAmm;
  loaded: boolean;
  isAmmRunning: boolean;
  error: boolean;
} {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();

  const [cowAmm, setCowAmm] = useState<ICowAmm>();
  const [isAmmRunning, setIsAmmRunning] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { assets } = useSafeBalances();

  useEffect(() => {
    async function loadCowAmm() {
      try {
        const [gqlInfo, newIsAmmRunning] = await Promise.all([
          fetchLastAmmInfo({
            chainId: chainId as ChainId,
            safeAddress: safeAddress as Address,
          }),
          checkAmmRunning(chainId as ChainId, safeAddress as Address),
        ]);

        const token0 = assets.find(
          (asset) =>
            asset.tokenInfo.address.toLowerCase() ===
            gqlInfo?.token0?.address.toLowerCase()
        );
        const token1 = assets.find(
          (asset) =>
            asset.tokenInfo.address.toLowerCase() ===
            gqlInfo?.token1?.address.toLowerCase()
        );

        if (!token0 || !token1) {
          setLoaded(true);
          return;
        }

        const totalUsdValue =
          (Number(token0.fiatBalance) || 0) + (Number(token1.fiatBalance) || 0);

        setCowAmm({
          token0,
          token1,
          totalUsdValue,
          minTradedToken0: gqlInfo?.minTradedToken0 as number,
          priceOracle: gqlInfo?.priceOracleType as PRICE_ORACLES,
          priceOracleData: gqlInfo?.priceOracleDataDecoded as PriceOracleData,
        });
        setIsAmmRunning(newIsAmmRunning);
      } catch (e) {
        setError(true);
      }
      setLoaded(true);
    }

    loadCowAmm();
  }, [safeAddress, chainId, assets]);

  return { cowAmm, loaded, isAmmRunning, error };
}
