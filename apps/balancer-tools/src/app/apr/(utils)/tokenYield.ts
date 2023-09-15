import { Address, NetworkChainId } from "@bleu-balancer-tools/utils";
import { createPublicClient, http, zeroAddress } from "viem";
import { mainnet } from "viem/chains";

import { blocks, pools } from "#/lib/gql/server";

const rateProviderAbi = [
  {
    inputs: [],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

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
          ),
        }),
      ),
  );
}

async function getAPRFromRateProviderInterval(
  rateProviderAddress: Address,
  timeStart: number,
  timeEnd: number,
) {
  const { endRate, startRate } = await getIntervalRates(
    rateProviderAddress,
    timeStart,
    timeEnd,
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

  if (!data.pool?.priceRateProviders?.length)
    return [
      {
        address: "0x1a8F81c256aee9C640e14bB0453ce247ea0DFE6F",
        token: {
          address: "0xae78736cd615f374d3085123a210448e74fc6393",
          symbol: "rETH",
        },
      },
    ];

  return data.pool?.priceRateProviders;
}
async function getIntervalRates(
  rateProviderAddress: Address,
  timeStart: number,
  timeEnd: number,
) {
  const dataStart = await blocks.gql(String(NetworkChainId.ETHEREUM)).Blocks({
    timestamp_gte: timeStart,
    timestamp_lt: timeEnd,
  });

  const dataEnd = await blocks.gql(String(NetworkChainId.ETHEREUM)).Blocks({
    timestamp_gte: timeEnd,
    timestamp_lt: timeEnd + SECONDS_IN_DAY,
  });

  const blockStart = dataStart.blocks[0].number;

  const blockEnd = dataEnd.blocks[0]?.number;

  const [endRate, startRate] = await Promise.all([
    getRateAtBlock(rateProviderAddress, blockEnd),
    getRateAtBlock(rateProviderAddress, blockStart),
  ]);

  return { endRate: Number(endRate), startRate: Number(startRate) };
}

async function getRateAtBlock(
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
    rate = await publicClient.readContract(args);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    rate = -1;
  }

  return Number(rate);
}
