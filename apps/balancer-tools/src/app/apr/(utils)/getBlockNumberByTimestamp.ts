import { NetworkChainId } from "@bleu-balancer-tools/utils";

import { blocks } from "#/lib/gql/server";

import { dateToEpoch } from "../api/(utils)/date";

const GNOSIS_API_EXPLORER = (timestamp: number): string =>
  `https://api.gnosisscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`;

async function bestGuess(chain: number, timestamp: number): Promise<number> {
  if (chain !== 100) {
    throw new Error(
      `Invalid chain ID for bestGuess function. Chain ID: ${chain}`,
    );
  }

  const url = GNOSIS_API_EXPLORER(timestamp);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from Gnosis API. HTTP Status: ${response.status}, URL: ${url}`,
    );
  }

  const data = await response.json();

  if (!data.result) {
    throw new Error(
      `No block found using the Gnosis API. Timestamp: ${timestamp}`,
    );
  }

  return Number(data.result);
}

export default async function getBlockNumberByTimestamp(
  chain: number,
  endTime: number,
): Promise<number> {
  if (endTime > dateToEpoch(new Date())) {
    throw new Error(
      `The specified endTime cannot be in the future. EndTime: ${endTime}`,
    );
  }

  if (chain === NetworkChainId.GNOSIS) {
    return bestGuess(chain, endTime);
  }

  const data = await blocks.gql(String(chain)).Blocks({
    timestamp_gte: endTime,
  });

  if (data.blocks.length === 0) {
    throw new Error(
      `No blocks found in the specified time range. Chain: ${chain}, endTime: ${endTime}`,
    );
  }

  return Number(data.blocks[0].number);
}
