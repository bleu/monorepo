import { PoolSnapshotInRangeTokenQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Arbitrum.server";
import { Address, networkFor, networkIdFor } from "@bleu-balancer-tools/utils";
import * as Sentry from "@sentry/nextjs";
import { zeroAddress } from "viem";

import { withCache } from "#/lib/cache";
import { DefiLlamaAPI } from "#/lib/defillama";
import { pools, poolsWithCache } from "#/lib/gql/server";
import { GetDeepProp } from "#/utils/getTypes";

import { generateDateRange, SECONDS_IN_YEAR } from "../api/(utils)/date";
import { ChainName, publicClients } from "./chainsPublicClients";
import { getTokenPriceByDate } from "./getBALPriceForDateRange";
import { manualPoolsRateProvider } from "./poolsRateProvider";
import { PoolTypeEnum } from "./types";
import { vunerabilityAffecteRateProviders } from "./vunerabilityAffectedPool";

type Snapshot = GetDeepProp<PoolSnapshotInRangeTokenQuery, "poolSnapshots">;
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

export async function getPoolTokensAprForDateRange(
  chain: string,
  poolId: Address,
  timeStart: number,
  timeEnd: number
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
              yield: await getAPRFromRateProviderInterval({
                rateProviderAddress: rateProviderAddress as Address,
                timeStart,
                timeEnd,
                chainName,
                poolId,
                tokenAddress: tokenAddress as Address,
              }),
            };
          } catch (error) {
            return {
              address: tokenAddress,
              symbol,
              yield: 0,
            };
          }
        }
      )
  );
}

async function getAPRFromRateProviderInterval({
  rateProviderAddress,
  timeStart,
  timeEnd,
  chainName,
  poolId,
  tokenAddress,
}: {
  rateProviderAddress: Address;
  timeStart: number;
  timeEnd: number;
  chainName: ChainName;
  poolId: string;
  tokenAddress: Address;
}) {
  if (
    timeEnd >= 1692662400 && // pool vunerability was found on August 22
    vunerabilityAffecteRateProviders.some(
      ({ address }) => address === rateProviderAddress
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
      poolId
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

    const tokenYield = getAPRFromRate(startRate, endRate, timeStart, timeEnd);

    const tokenWeight = await getTokenWeight(
      tokenAddress,
      timeStart,
      timeEnd,
      networkIdFor(chainName),
      poolId
    );

    const apr = await calculateTokenApr({
      tokenYield,
      poolId,
      chain: networkIdFor(chainName),
      tokenAddress,
      tokenWeight,
      timeStart,
      timeEnd,
    });

    Sentry.addBreadcrumb({
      category: "getAPRFromRateProviderInterval",
      message: "apr: " + apr,
      level: "info",
    });

    if (!apr) {
      return 0;
    }

    if (apr < 0) {
      // eslint-disable-next-line no-console
      console.error(
        `Negative APR for Pool ${poolId} ${rateProviderAddress} between ${timeStart} and ${timeEnd}: ${apr}`
      );
      Sentry.captureMessage(
        `Negative APR for ${rateProviderAddress} between ${timeStart} and ${timeEnd}: ${apr}`
      );

      return 0;
    }

    return apr;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching rate for ${rateProviderAddress} between ${timeStart} and ${timeEnd} chain ${chainName} poolId ${poolId} - ${e}`
    );
    Sentry.captureException(e);
    throw e;
  }
}

function getAPRFromRate(
  rateStart: number,
  rateEnd: number,
  timeStart: number,
  timeEnd: number
) {
  const duration = timeEnd - timeStart;
  const rateOfReturn = (rateEnd - rateStart) / rateStart;
  const annualScalingFactor = SECONDS_IN_YEAR / duration;

  return rateOfReturn * annualScalingFactor * 100;
}

const getPoolTokensRateProviders = withCache(
  async function getPoolTokensRateProvidersFn(
    chain: string,
    poolId: Address
  ): Promise<
    { address: string; token: { address: string; symbol: string } }[]
  > {
    const data = await pools.gql(String(chain)).PoolRateProviders({ poolId });

    if (!data.pool?.priceRateProviders?.length) {
      const poolRateProvider = manualPoolsRateProvider.find(
        ({ poolAddress }) => poolAddress.toLowerCase() === poolId.toLowerCase()
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
  }
);

async function getIntervalRates(
  rateProviderAddress: Address,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
  poolId: string
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

const getRateAtBlock = withCache(async function getRateAtBlockFn(
  chainName: ChainName,
  rateProviderAddress: Address,
  poolId: string,
  blockNumber?: number
): Promise<number | undefined> {
  const args = {
    address: rateProviderAddress,
    abi: rateProviderAbi,
    functionName: "getRate",
    ...(blockNumber ? { blockNumber: BigInt(blockNumber) } : {}),
  } as const;

  let rate;
  try {
    rate = await publicClients[chainName].readContract(args);
    return Number(rate);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`
      Error fetching rate for ${rateProviderAddress} at block ${blockNumber} chain ${chainName} poolId ${poolId} - ${e}.
      Maybe this is a proxy contract? Trying to get implementation to get to rate provider.
    `);
    const actualRateProvider = await getImplementationAddress(
      chainName,
      rateProviderAddress,
      blockNumber
    );
    if (actualRateProvider) {
      return getRateAtBlock(chainName, actualRateProvider, poolId, blockNumber);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Error fetching rate for ${rateProviderAddress} chain ${chainName} poolId ${poolId} on ${blockNumber}. This is probably a Linear pool and the call reverted, in which case we can assume value 0.`
      );
      return 0;
    }
  }
});

const getImplementationAddress = async (
  chainName: ChainName,
  rateProviderAddress: Address,
  blockNumber?: number
): Promise<Address | undefined> => {
  try {
    const implementationContract = await publicClients[chainName].readContract({
      address: rateProviderAddress,
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
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching implementation contract for ${rateProviderAddress} - ${error}`
    );
    return undefined;
  }
};

async function calculateTokenApr({
  tokenYield,
  poolId,
  chain,
  tokenAddress,
  tokenWeight,
  timeStart,
  timeEnd,
}: {
  tokenYield: number;
  poolId: string;
  chain: string;
  tokenAddress: Address;
  tokenWeight: number;
  timeStart: number;
  timeEnd: number;
}) {
  const rangeData = await poolsWithCache.gql(chain).poolSnapshotInRangeToken({
    poolId,
    timestamp: generateDateRange(timeStart, timeEnd),
  });

  let pool: Pool;

  if (rangeData.poolSnapshots.length > 0) {
    pool = rangeData.poolSnapshots[0].pool;
  } else {
    const currentPoolData = await pools.gql(chain).Pool({ poolId });
    if (!currentPoolData || !currentPoolData.pool) {
      throw new Error("Pool data is not found or is invalid.");
    }
    pool = currentPoolData.pool;
  }

  if (!pool || !pool.tokens) {
    return 0;
  }

  let apr;

  if (
    pool.poolType === PoolTypeEnum.PHANTOM_STABLE ||
    (pool.poolType === PoolTypeEnum.WEIGHTED &&
      (pool.poolTypeVersion ?? 0) >= 2)
  ) {
    const isExemptFromYieldProtocolFee = pool?.tokens.find(
      ({ address }) => address === tokenAddress
    )?.isExemptFromYieldProtocolFee;

    if (isExemptFromYieldProtocolFee) {
      apr = tokenYield;
    } else {
      apr = tokenYield * (1 - pool.protocolYieldFeeCache || 0.5);

      //normalize by weight
      apr = apr * tokenWeight;
    }
  }

  return apr;
}

async function getTokenWeight(
  tokenAddress: string,
  startAtTimestamp: number,
  endAtTimestamp: number,
  poolNetwork: string,
  poolId: string
): Promise<number> {
  const rangeData = await poolsWithCache
    .gql(poolNetwork)
    .poolSnapshotInRangeToken({
      poolId,
      timestamp: generateDateRange(startAtTimestamp, endAtTimestamp),
    });

  let poolData: Pool;

  if (rangeData.poolSnapshots.length > 0) {
    poolData = rangeData.poolSnapshots[0].pool;
  } else {
    const currentPoolData = await pools.gql(poolNetwork).Pool({ poolId });
    if (!currentPoolData || !currentPoolData.pool) {
      throw new Error("Pool data is not found or is invalid.");
    }
    poolData = currentPoolData.pool;
  }

  const poolTokenData = poolData.tokens?.filter((token) => {
    return token.address !== poolData.address; // Adjusted this line based on typical data structure
  });

  if (!Array.isArray(poolTokenData)) {
    return 0;
  }

  const token = poolTokenData.find((t) => t.address === tokenAddress);
  if (!token) {
    // eslint-disable-next-line no-console
    console.warn(`Token not found in pool for address: ${tokenAddress}`);
    return 0;
  }

  if (poolData.poolType === PoolTypeEnum.WEIGHTED && token.weight) {
    return parseFloat(token.weight);
  }

  const tokensPrices = await Promise.all(
    poolTokenData.map(async (token) => {
      const tokenPrice = await getTokenPriceByDate(
        endAtTimestamp,
        token.address,
        parseInt(poolNetwork)
      );
      if (tokenPrice === undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          `Failed fetching price for ${token.symbol}(network:${poolNetwork},addr:${token.address}) at ${endAtTimestamp}`
        );
      }
      return tokenPrice === undefined ? 1 : tokenPrice;
    })
  );

  const totalValue = poolTokenData.reduce((acc, token, idx) => {
    const balance = parseFloat(token.balance);
    if (!isNaN(balance)) {
      return acc + tokensPrices[idx] * balance;
    }
    return acc;
  }, 0);

  const tokenIdx = poolTokenData.findIndex((t) => t.address === tokenAddress);
  const tokenPrice = tokensPrices[tokenIdx];

  const tokenValue = tokenPrice * parseFloat(token.balance);
  const tokenWeight = tokenValue / totalValue;

  return tokenWeight;
}
