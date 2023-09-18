import { Address, networkFor, networkIdFor } from "@bleu-balancer-tools/utils";
import { zeroAddress } from "viem";

import { blocks, pools } from "#/lib/gql/server";

import { ChainName, publicClients } from "./chainsPublicClients";
import { manualPoolsRateProvider } from "./poolsRateProvider";

const rateProviderAbi = [
  {
    inputs: [],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const SECONDS_IN_DAY = 86400;
const DAYS_IN_YEAR = 365;
const SECONDS_IN_YEAR = DAYS_IN_YEAR * SECONDS_IN_DAY;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPoolTokensAprForDate(
  chain: string,
  poolId: Address,
  date: number,
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
            rateProviderAddress,
            date - SECONDS_IN_DAY,
            date,
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
  const { endRate, startRate } = await getIntervalRates(
    rateProviderAddress,
    timeStart,
    timeEnd,
    chainName,
  );

  return getAPRFromRate(startRate, endRate, timeStart, timeEnd);
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

  const APR = rateOfReturn * annualScalingFactor * 100;

  if (APR < 0) {
    // eslint-disable-next-line no-console
    console.error("Negative APR");
  }
  return APR < 0 ? 0 : APR;
}

async function getPoolTokensRateProviders(chain: string, poolId: Address) {
  const data = await pools.gql(String(chain)).PoolRateProviders({ poolId });

  if (!data.pool?.priceRateProviders?.length) {
    const poolRateProvider = manualPoolsRateProvider.find(
      ({ poolAddress }) => poolAddress === poolId,
    );

    if (poolRateProvider === undefined) {
      // eslint-disable-next-line no-console
      console.error(
        `Pool ${poolId} from ${chain} not found in manualPoolsRateProvider`,
      );
    }

    const rateProvider = poolRateProvider || manualPoolsRateProvider[0];

    return [
      {
        address: rateProvider.address,
        token: {
          address: rateProvider.token.address,
          symbol: rateProvider.token.symbol,
        },
      },
    ];
  }

  return data.pool?.priceRateProviders;
}
async function getIntervalRates(
  rateProviderAddress: Address,
  timeStart: number,
  timeEnd: number,
  chainName: ChainName,
) {
  const dataStart = await blocks.gql(String(networkIdFor(chainName))).Blocks({
    timestamp_gte: timeStart,
    timestamp_lt: timeEnd,
  });

  const dataEnd = await blocks.gql(String(networkIdFor(chainName))).Blocks({
    timestamp_gte: timeEnd,
    timestamp_lt: timeEnd + SECONDS_IN_DAY,
  });

  const blockStart = dataStart.blocks[0].number;

  const blockEnd = dataEnd.blocks[0]?.number;

  const [endRate, startRate] = await Promise.all([
    getRateAtBlock(chainName, rateProviderAddress, blockEnd),
    getRateAtBlock(chainName, rateProviderAddress, blockStart),
  ]);

  return { endRate: Number(endRate), startRate: Number(startRate) };
}

async function getRateAtBlock(
  chainName: ChainName,
  rateProviderAddress: Address,
  blockNumber?: number,
) {
  const args = {
    address: rateProviderAddress,
    abi: rateProviderAbi,
    functionName: "getRate",
    blockNumber: blockNumber ? BigInt(blockNumber) : undefined,
  } as const;

  let rate;
  try {
    rate = await publicClients[chainName].readContract(args);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    rate = -1;
  }

  return Number(rate);
}
