/* eslint-disable no-console */
import { DefiLlamaAPI } from "@bleu-fi/balancer-apr/src/lib/defillama";
import { PoolSnapshotInRangeQuery } from "@bleu-fi/gql/src/balancer/__generated__/Ethereum";
import { Address, networkIdFor } from "@bleu-fi/utils";
import { SECONDS_IN_YEAR } from "@bleu-fi/utils/date";
import * as Sentry from "@sentry/nextjs";

import { withCache } from "#/lib/cache";
import { pools } from "#/lib/gql/server";
import { GetDeepProp } from "#/utils/getTypes";

import { ChainName, publicClients } from "../chainsPublicClients";
import { manualPoolsRateProvider } from "../poolsRateProvider";
import { vunerabilityAffecteRateProviders } from "../vunerabilityAffectedPool";
import { createAprStrategy } from "./aprStrategies";
import { fetchPoolData, getTokenWeight } from "./utils";

type Snapshot = GetDeepProp<PoolSnapshotInRangeQuery, "poolSnapshots">;
type Pool = Snapshot[number]["pool"];

const rateProviderAbi = [
  {
    inputs: [],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export async function getAPRFromRateProviderInterval(
  rateProviderAddress: string,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
  poolId: string,
  tokenAddress: string,
) {
  const timeStampVunerabilityFound = 1692662400; // August 22 of 2023
  if (
    timeEnd >= timeStampVunerabilityFound &&
    vunerabilityAffecteRateProviders.some(
      ({ address }) => address === rateProviderAddress,
    )
  ) {
    return 0;
  }

  try {
    const { endRate, startRate } = await getIntervalRates(
      rateProviderAddress,
      timeStart,
      timeEnd,
      chainName,
      poolId,
    );

    Sentry.addBreadcrumb({
      category: "getAPRFromRateProviderInterval",
      message: "endRate: " + endRate,
      level: "info",
    });
    Sentry.addBreadcrumb({
      category: "getAPRFromRateProviderInterval",
      message: "startRate: " + startRate,
      level: "info",
    });

    const poolData = await fetchPoolData(
      networkIdFor(chainName),
      poolId,
      timeStart,
      timeEnd,
    );

    const tokenYield = getAPRFromRate(startRate, endRate, timeStart, timeEnd);

    const tokenWeight = poolData
      ? await getTokenWeight(
          tokenAddress,
          timeEnd,
          networkIdFor(chainName),
          poolData,
        )
      : 0;

    const apr = poolData
      ? calculateTokenApr(tokenYield, poolData, tokenAddress, tokenWeight)
      : 0;

    Sentry.addBreadcrumb({
      category: "getAPRFromRateProviderInterval",
      message: "apr: " + apr,
      level: "info",
    });

    if (!apr) {
      return 0;
    }

    if (apr < 0) {
      console.error(
        `Negative APR for Pool ${poolId} ${rateProviderAddress} between ${timeStart} and ${timeEnd}: ${apr}`,
      );
      Sentry.captureMessage(
        `Negative APR for ${rateProviderAddress} between ${timeStart} and ${timeEnd}: ${apr}`,
      );

      return 0;
    }

    return apr;
  } catch (e) {
    console.error(
      `Error fetching rate for ${rateProviderAddress} between ${timeStart} and ${timeEnd} chain ${chainName} poolId ${poolId} - ${e}`,
    );
    Sentry.captureException(e);
    throw e;
  }
}

export function calculateTokenApr(
  tokenYield: number,
  poolData: Pool,
  tokenAddress: string,
  tokenWeight: number,
) {
  const aprStrategy = createAprStrategy(poolData, tokenAddress);

  if (!aprStrategy) {
    console.error(
      `Failed to find Token APR strategy for token ${tokenAddress}`,
    );
    return 0;
  }

  const apr = aprStrategy.calculateApr(tokenYield, poolData, tokenAddress);

  //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L192
  return apr * tokenWeight;
}

export function getAPRFromRate(
  rateStart: number,
  rateEnd: number,
  timeStart: number,
  timeEnd: number,
) {
  const duration = timeEnd - timeStart;
  const rateOfReturn = (rateEnd - rateStart) / rateStart;
  const annualScalingFactor = SECONDS_IN_YEAR / duration;

  return rateOfReturn * annualScalingFactor * 100;
}

export const getPoolTokensRateProviders = withCache(
  async function getPoolTokensRateProvidersFn(
    chain: string,
    poolId: Address,
  ): Promise<
    { address: string; token: { address: string; symbol: string } }[]
  > {
    const data = await pools.gql(String(chain)).PoolRateProviders({ poolId });

    if (!data.pool?.priceRateProviders?.length) {
      const poolRateProvider = manualPoolsRateProvider.find(
        ({ poolAddress }) => poolAddress.toLowerCase() === poolId.toLowerCase(),
      );

      if (poolRateProvider === undefined) {
        return [];
      }

      return [
        {
          address: poolRateProvider.address,
          token: {
            address: poolRateProvider.token.address,
            symbol: poolRateProvider.token.symbol,
          },
        },
      ];
    }

    return data.pool?.priceRateProviders;
  },
);

export async function getIntervalRates(
  rateProviderAddress: string,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
  poolId: string,
) {
  const [blockStart, blockEnd] = await Promise.all([
    await DefiLlamaAPI.findBlockNumber(chainName, timeStart),
    await DefiLlamaAPI.findBlockNumber(chainName, timeEnd),
  ]);
  const [endRate, startRate] = await Promise.all([
    getRateAtBlock(chainName, rateProviderAddress, poolId, blockEnd),
    getRateAtBlock(chainName, rateProviderAddress, poolId, blockStart),
  ]);

  return { endRate: Number(endRate), startRate: Number(startRate) };
}

export const getRateAtBlock = withCache(async function getRateAtBlockFn(
  chainName: ChainName,
  rateProviderAddress: string,
  poolId: string,
  blockNumber?: number,
): Promise<number | undefined> {
  const args = {
    address: rateProviderAddress as Address,
    abi: rateProviderAbi,
    functionName: "getRate",
    ...(blockNumber ? { blockNumber: BigInt(blockNumber) } : {}),
  } as const;

  let rate;
  try {
    rate = await publicClients[chainName].readContract(args);
    return Number(rate);
  } catch (e) {
    console.error(`
        Error fetching rate for ${rateProviderAddress} at block ${blockNumber} chain ${chainName} poolId ${poolId} - ${e}.
        Maybe this is a proxy contract? Trying to get implementation to get to rate provider.
      `);
    const actualRateProvider = await getImplementationAddress(
      chainName,
      rateProviderAddress,
      blockNumber,
    );
    if (actualRateProvider) {
      return getRateAtBlock(chainName, actualRateProvider, poolId, blockNumber);
    } else {
      console.error(
        `Error fetching rate for ${rateProviderAddress} chain ${chainName} poolId ${poolId} on ${blockNumber}. This is probably a Linear pool and the call reverted, in which case we can assume value 0.`,
      );
      return 0;
    }
  }
});

const getImplementationAddress = async (
  chainName: ChainName,
  rateProviderAddress: string,
  blockNumber?: number,
): Promise<Address | undefined> => {
  try {
    const implementationContract = await publicClients[chainName].readContract({
      address: rateProviderAddress as Address,
      abi: [
        {
          inputs: [],
          name: "implementation",
          outputs: [
            {
              internalType: "address",
              name: "implementation_",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "implementation",
      ...(blockNumber ? { blockNumber: BigInt(blockNumber) } : {}),
    } as const);

    return implementationContract;
  } catch (error) {
    console.error(
      `Error fetching implementation contract for ${rateProviderAddress} - ${error}`,
    );
    return undefined;
  }
};
