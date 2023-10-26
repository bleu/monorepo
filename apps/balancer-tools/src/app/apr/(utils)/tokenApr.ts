/* eslint-disable no-console */
import { PoolSnapshotInRangeQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";
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

async function getAPRFromRateProviderInterval(
  rateProviderAddress: string,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
  poolId: string,
  tokenAddress: string,
) {
  const timeStampVunerabilityFound = 1629638400; // August 22
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
      ? await calculateTokenApr(tokenYield, poolData, tokenAddress, tokenWeight)
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

function getAPRFromRate(
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

const getPoolTokensRateProviders = withCache(
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

async function getIntervalRates(
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

const getRateAtBlock = withCache(async function getRateAtBlockFn(
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

async function calculateTokenApr(
  tokenYield: number,
  poolData: Pool,
  tokenAddress: string,
  tokenWeight: number,
) {
  const DEFAULT_PROTOCOL_YIELD_FEE = 0.5;
  const DEFAULT_PROTOCOL_SWAP_FEE = 0.5;

  const {
    tokens,
    poolType,
    poolTypeVersion,
    protocolYieldFeeCache,
    protocolSwapFeeCache,
  } = poolData ?? {};

  let apr;

  //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L127
  if (
    poolType === PoolTypeEnum.PHANTOM_STABLE ||
    (poolType === PoolTypeEnum.WEIGHTED && (poolTypeVersion ?? 0) >= 2)
  ) {
    const isExemptFromYieldProtocolFee = tokens?.find(
      ({ address }) => address === tokenAddress,
    )?.isExemptFromYieldProtocolFee;

    if (isExemptFromYieldProtocolFee) {
      apr = tokenYield;
    } else {
      //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L134
      apr =
        tokenYield *
        (1 - (protocolYieldFeeCache ?? DEFAULT_PROTOCOL_YIELD_FEE));
    }
  } else if (
    poolType === PoolTypeEnum.META_STABLE ||
    poolType?.includes("Gyro")
  ) {
    //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L124
    apr = tokenYield * (protocolSwapFeeCache ?? DEFAULT_PROTOCOL_SWAP_FEE);
  }

  //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L192
  apr = (apr || 0) * tokenWeight;

  return apr;
}

async function getTokenWeight(
  tokenAddress: string,
  endAtTimestamp: number,
  poolNetwork: string,
  poolData: Pool,
): Promise<number> {
  const { tokens, poolType, address: poolAddress } = poolData ?? {};

  const relevantTokens =
    tokens?.filter(({ address }) => address !== poolAddress) || [];

  const targetToken = relevantTokens.find(
    ({ address }) => address === tokenAddress,
  );

  if (!targetToken) {
    console.warn(`Token not found: ${tokenAddress}`);
    return 0;
  }

  if (poolType === "WEIGHTED" && targetToken.weight)
    return parseFloat(targetToken.weight);

  const tokenPrices = await fetchTokenPrices(
    relevantTokens,
    endAtTimestamp,
    poolNetwork,
  );
  const totalValue = relevantTokens
    .map(({ balance }, idx) => parseFloat(balance) * tokenPrices[idx])
    .filter((val) => !isNaN(val))
    .reduce((acc, val) => acc + val, 0);

  const tokenIdx = relevantTokens.findIndex(
    ({ address }) => address === tokenAddress,
  );
  return (parseFloat(targetToken.balance) * tokenPrices[tokenIdx]) / totalValue;
}

async function fetchPoolData(
  chain: string,
  poolId: string,
  timeStart: number,
  timeEnd: number,
): Promise<Pool | null> {
  const rangeData = await poolsWithCache.gql(chain).poolSnapshotInRange({
    poolId,
    timestamp: generateDateRange(timeStart, timeEnd),
  });
  if (rangeData.poolSnapshots.length > 0) {
    return rangeData.poolSnapshots[0].pool;
  }
  const currentPoolData = await pools.gql(chain).Pool({ poolId });
  return currentPoolData?.pool || null;
}

async function fetchTokenPrices(
  relevantTokens: { address: string; symbol: string }[],
  endAtTimestamp: number,
  poolNetwork: string,
): Promise<number[]> {
  return Promise.all(
    relevantTokens.map(async (token) => {
      if (
        vunerabilityAffecteRateProviders.some(
          ({ address }) =>
            address.toLowerCase() === token.address.toLowerCase(),
        )
      ) {
        return 1;
      } else {
        const tokenPrice = await getTokenPriceByDate(
          endAtTimestamp,
          token.address,
          parseInt(poolNetwork),
        );

        if (tokenPrice === undefined) {
          console.warn(
            `Failed fetching price for ${token.symbol} (network: ${poolNetwork}, addr: ${token.address}) at ${endAtTimestamp}`,
          );
          return 1;
        }

        return tokenPrice;
      }
    }),
  );
}
