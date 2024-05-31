/* eslint-disable @typescript-eslint/no-explicit-any */

import { dateToEpoch } from "@bleu/utils/date";
import { NETWORK_TO_BALANCER_ENDPOINT_MAP } from "lib/config";
import { addToTable, BATCH_SIZE } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";
import { paginatedFetch } from "lib/paginatedFetch";

import { poolSnapshotsTemp } from "../../../db/schema";
import { networkNames } from "../../../index";

const POOLS_SNAPSHOTS = `
query PoolSnapshots($latestId: ID!, $today: Int!) {
  poolSnapshots(
    first: 1000,
    where: {
      id_gt: $latestId,
      timestamp_not: $today,
    }
  ) {
    id
    pool {
      id
      protocolYieldFeeCache
      protocolSwapFeeCache
    }
    amounts
    totalShares
    swapVolume
    protocolFee
    swapFees
    liquidity
    timestamp
  }
}
`;

export async function extractPoolSnapshots() {
  logIfVerbose("Starting Pool Snapshots Extraction");

  return await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_BALANCER_ENDPOINT_MAP[networkName];
      await extractPoolSnapshotsForNetwork(networkEndpoint, networkName);
    })
  );
}

async function processPoolSnapshots(data: any, network: string) {
  logIfVerbose(`Processing pool snapshots for network ${network}`);

  if (data.poolSnapshots) {
    await addToTable(
      poolSnapshotsTemp,
      data.poolSnapshots.map((snapshot: any) => ({
        externalId: snapshot.id,
        rawData: { ...snapshot, network },
        networkSlug: network,
        timestamp: new Date(snapshot.timestamp * 1000),
      }))
    );
  }
}

export async function extractPoolSnapshotsForNetwork(
  networkEndpoint: string,
  network: string
) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await paginatedFetch(
    networkEndpoint,
    POOLS_SNAPSHOTS,
    (data) => processPoolSnapshots(data, network),
    "",
    BATCH_SIZE,
    { today: dateToEpoch(today) }
  );
}
