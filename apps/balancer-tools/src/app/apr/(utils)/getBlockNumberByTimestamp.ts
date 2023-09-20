import { NetworkChainId } from "@bleu-balancer-tools/utils";

import { blocks } from "#/lib/gql/server";

const MINUTE_IN_SECONDS = 60;

const GNOSIS_API_EXPLORER = (timestamp: number): string =>
  `https://api.gnosisscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`;

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
  endTime: Date,
): Promise<number> {
  if (endTime > new Date()) {
    return -1;
  }

  const timestamps = getTimestamps(endTime);

  if (chain === NetworkChainId.GNOSIS) {
    return bestGuess(chain, parseInt(timestamps.timestamp_gte));
  }

  const data = await blocks.gql(String(chain)).Blocks({
    timestamp_gte: timestamps.timestamp_gte,
    timestamp_lt: timestamps.timestamp_lt,
  });

  if (data.blocks.length > 0) {
    return parseInt(data.blocks[0].number);
  }

  return 0;
}
