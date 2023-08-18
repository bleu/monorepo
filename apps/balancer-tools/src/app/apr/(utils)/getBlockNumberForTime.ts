import { gql } from "./balancerAPI";

const MINUTE_IN_SECONDS = 60;

const BLOCKS_SUBGRAPH_URL_MAP: Record<string, string> = {
  1: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
  137: "https://api.thegraph.com/subgraphs/name/ianlapham/polygon-blocks",
  42161:
    "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks",
};

const GNOSIS_API_EXPLORER = (timestamp: number): string =>
  `https://api.gnosisscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${process.env.GNOSIS_API_KEY}`;

const BLOCKS_QUERY = `
  query($timestamp_gte: BigInt, $timestamp_lt: BigInt) {
    blocks(
      first: 1,
      orderBy: number,
      orderDirection: asc,
      where: {
        timestamp_gte: $timestamp_gte,
        timestamp_lt: $timestamp_lt
      }
    ) {
      number
    }
  }
`;

async function bestGuess(chain: number, timestamp: number): Promise<number> {
  if (chain !== 100) {
    return 0;
  }
  const url = GNOSIS_API_EXPLORER(timestamp);
  const response = await fetch(url);
  const data = await response.json();
  return parseInt(data.result);
}

function getTimestamps(time: Date): Record<string, string> {
  const timestamp_gte = (time.getTime() / 1000).toString();
  const timestamp_lt = (
    time.getTime() / 1000 +
    MINUTE_IN_SECONDS * 10
  ).toString();
  return { timestamp_gte, timestamp_lt };
}

export default async function getBlockNumberByTimestamp(
  chain: number,
  poolEndTime: Date,
): Promise<number> {
  if (poolEndTime > new Date()) {
    return -1;
  }

  const timestamps = getTimestamps(poolEndTime);
  const url = BLOCKS_SUBGRAPH_URL_MAP[chain];

  if (!url) {
    return bestGuess(chain, parseInt(timestamps.timestamp_gte));
  }

  const { data } = await gql(url, BLOCKS_QUERY, timestamps);

  if (data.blocks.length > 0) {
    return parseInt(data.blocks[0].number);
  }

  return 0;
}
