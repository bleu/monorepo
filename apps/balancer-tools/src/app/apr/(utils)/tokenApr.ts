import { Address, networkFor, networkIdFor } from "@bleu-balancer-tools/utils";
import { zeroAddress } from "viem";

import { withCache } from "#/lib/cache";
import { pools } from "#/lib/gql/server";

import { SECONDS_IN_DAY, SECONDS_IN_YEAR } from "../api/(utils)/date";
import { ChainName, publicClients } from "./chainsPublicClients";
import getBlockNumberByTimestamp from "./getBlockNumberByTimestamp";
import { manualPoolsRateProvider } from "./poolsRateProvider";
import { vunerabilityAffecteRateProviders } from "./vunerabilityAffectedPool";

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
  startAt: number,
  endAt: number,
) {
  const rateProviders = await getPoolTokensRateProviders(chain, poolId);

  const chainName = networkFor(chain) as ChainName;

  return await Promise.all(
    rateProviders
      .filter(({ address }) => address !== zeroAddress)
      .map(
        async ({
          address: rateProviderAddress,
          token: { symbol, address: tokenAddress },
        }) => ({
          address: tokenAddress,
          symbol,
          yield: await getAPRFromRateProviderInterval(
            rateProviderAddress as Address,
            startAt,
            endAt,
            chainName,
          ),
        }),
      ),
  );
}

async function getAPRFromRateProviderInterval(
  rateProviderAddress: Address,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
) {
  if (
    timeEnd >= 1692662400 && // pool vunerability was found on August 22
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
    );

    const apr = getAPRFromRate(startRate, endRate, timeStart, timeEnd);

    if (apr < 0) {
      // eslint-disable-next-line no-console
      console.error(
        `Negative APR for ${rateProviderAddress} between ${timeStart} and ${timeEnd}: ${apr}`,
      );
      return 0;
    }

    return apr;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching rate for ${rateProviderAddress} between ${timeStart} and ${timeEnd} chain ${chainName} - ${e}`,
    );
    return 0;
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
  rateProviderAddress: Address,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
) {
  const [blockStart, blockEnd] = await Promise.all([
    getBlockNumberByTimestamp(parseInt(networkIdFor(chainName)), timeStart),
    getBlockNumberByTimestamp(
      parseInt(networkIdFor(chainName)),
      timeEnd + SECONDS_IN_DAY,
    ),
  ]);

  const [endRate, startRate] = await Promise.all([
    getRateAtBlock(chainName, rateProviderAddress, blockEnd),
    getRateAtBlock(chainName, rateProviderAddress, blockStart),
  ]);

  return { endRate: Number(endRate), startRate: Number(startRate) };
}

const getRateAtBlock = withCache(async function getRateAtBlockFn(
  chainName: ChainName,
  rateProviderAddress: Address,
  blockNumber?: number,
) {
  const args = {
    address: rateProviderAddress,
    abi: rateProviderAbi,
    functionName: "getRate",
    ...(blockNumber ? { blockNumber: BigInt(blockNumber) } : {}),
  } as const;

  let rate;
  try {
    rate = await publicClients[chainName].readContract(args);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching rate for ${rateProviderAddress} at block ${blockNumber} on ${chainName}, ${e}`,
    );
    rate = -1;
  }

  return Number(rate);
});
