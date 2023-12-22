/* eslint-disable @typescript-eslint/no-explicit-any */
import { NETWORK_TO_BALANCER_ENDPOINT_MAP } from "../../../config";
import { poolSnapshotsTemp } from "../../../db/schema";
import { addToTable, logIfVerbose, networkNames } from "../../../index";
import { paginatedFetch } from "../../../paginatedFetch";

const POOLS_SNAPSHOTS = `
query PoolSnapshots($latestId: String!) {
  poolSnapshots(
    first: 1000,
    where: {
      id_gt: $latestId,
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
    }),
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
      })),
    );
  }
}

export async function extractPoolSnapshotsForNetwork(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, POOLS_SNAPSHOTS, (data) =>
    processPoolSnapshots(data, network),
  );
}
