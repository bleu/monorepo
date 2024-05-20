/* eslint-disable @typescript-eslint/no-explicit-any */
import { vulnerabilityAffectedPools } from "lib/balancer/data/vulnerabilityAffectedPool";
import { NETWORK_TO_BALANCER_ENDPOINT_MAP } from "lib/config";
import { addToTable } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";
import { paginatedFetch } from "lib/paginatedFetch";
import { zeroAddress } from "viem";

import { pools, poolTokenRateProviders } from "../../../db/schema";
import { networkNames } from "../../../index";

const RATE_PROVIDER = `
query PoolRateProviders($latestId: String!) {
  priceRateProviders(
    first: 1000,
    where: {
      id_gt: $latestId,
    }
  ) {
    id
    poolId {
      id
    }
    token {
      address
    }
    address
  }
}
`;

async function extractPoolRateProvider(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, RATE_PROVIDER, (data) =>
    processPoolRateProvider(data, network),
  );
}

export async function extractPoolRateProviders() {
  logIfVerbose("Starting Rate Provider Extraction");
  await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_BALANCER_ENDPOINT_MAP[networkName];
      await extractPoolRateProvider(networkEndpoint, networkName);
    }),
  );
}

async function processPoolRateProvider(data: any, network: string) {
  logIfVerbose(`Processing pool rate provider for network ${network}`);

  if (data.priceRateProviders) {
    // First, update the 'pools' table to make sure all the external_id values are there.
    await addToTable(
      pools,
      data.priceRateProviders
        .filter(
          (priceRateProvider: any) => priceRateProvider.address !== zeroAddress,
        )
        .map((priceRateProviders: any) => ({
          externalId: priceRateProviders.poolId.id,
          networkSlug: network,
        })),
    );

    await addToTable(
      poolTokenRateProviders,
      data.priceRateProviders
        .filter(
          (priceRateProvider: any) => priceRateProvider.address !== zeroAddress,
        )
        .map((priceRateProviders: any) => ({
          externalId: priceRateProviders.id + "-" + network,
          address: priceRateProviders.address,
          vulnerabilityAffected: vulnerabilityAffectedPools.some(
            ({ address }) =>
              address.toLowerCase() ===
              priceRateProviders.token.address.toLowerCase(),
          ),
          poolExternalId: priceRateProviders.poolId.id,
          tokenAddress: priceRateProviders.token.address,
          networkSlug: network,
          rawData: { ...priceRateProviders, network },
        })),
    );
  }
}
