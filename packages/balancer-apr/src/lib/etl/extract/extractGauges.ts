/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "drizzle-orm";

import { ENDPOINT_V3, NETWORK_TO_REWARDS_ENDPOINT_MAP } from "../../../config";
import { db } from "../../../db";
import { gauges, pools } from "../../../db/schema";
import { gql } from "../../../gql";
import { addToTable, logIfVerbose, networkNamesRewards } from "../../../index";

export const API_VOTING_GAUGES_QUERY = `
query VeBalGetVotingList {
    veBalGetVotingList {
        chain
        id
        address
        symbol
        type
        gauge {
            address
            isKilled
            addedTimestamp
            relativeWeightCap
            childGaugeAddress
        }
        tokens {
            address
            logoURI
            symbol
            weight
        }
    }
}
`;

export const SUBGRAPH_GAUGES_QUERY = `
query PoolGauges {
  pools(first: 1000, where: {preferentialGauge_not:null}) {
    poolId
    preferentialGauge {
      gauge {
        addedTimestamp
      }
      id
      isKilled
      relativeWeightCap
    }
  }
}`;

export async function extractGauges() {
  logIfVerbose("Starting Gauges Extraction");

  await Promise.all([extractGaugesFromSubgraphs(), extractGaugesFromAPI()]);

  return await removeDuplicatedGauges();
}

async function removeDuplicatedGauges() {
  return await db.execute(sql`
  DELETE FROM gauges g USING gauges g1
WHERE g.address = g1.child_gauge_address
	AND g.child_gauge_address IS NULL;
  `);
}

async function extractGaugesFromSubgraphs() {
  return Promise.all(networkNamesRewards.map(extractGaugesFromSubgraph));
}

async function extractGaugesFromSubgraph(
  network: keyof typeof NETWORK_TO_REWARDS_ENDPOINT_MAP,
) {
  logIfVerbose("Starting Gauges Extraction from Subgraph");

  const response = await gql(
    NETWORK_TO_REWARDS_ENDPOINT_MAP[network],
    SUBGRAPH_GAUGES_QUERY,
  );

  const gaugesWithPoolId = response.data.pools
    .filter((pool: any) => pool.preferentialGauge !== null)
    .map((pool: any) => {
      return {
        poolExternalId: pool.poolId,
        address: pool.preferentialGauge.id,
        isKilled: pool.preferentialGauge.isKilled,
        networkSlug: network,
        externalCreatedAt: pool.preferentialGauge.gauge
          ? new Date(pool.preferentialGauge.gauge.addedTimestamp * 1000)
          : null,
        rawData: pool,
      };
    });

  await addToTable(
    pools,
    gaugesWithPoolId.map(
      (gauge: { poolExternalId: string; networkSlug: string }) => ({
        externalId: gauge.poolExternalId,
        networkSlug: gauge.networkSlug,
      }),
    ),
  );
  await addToTable(gauges, gaugesWithPoolId);

  logIfVerbose("Finished Gauges Extraction from Subgraph");
}

async function extractGaugesFromAPI() {
  logIfVerbose("Starting Gauges Extraction from API");

  const response = await gql(ENDPOINT_V3, API_VOTING_GAUGES_QUERY);

  const networkMap: { [key: string]: string } = {
    mainnet: "ethereum",
    zkevm: "polygon-zkevm",
  };

  const responseItems: {
    address: string;
    rawData: Record<string, any>;
    networkSlug: string;
    isKilled: boolean;
    poolExternalId: string;
    externalCreatedAt: Date;
  }[] = response.data.veBalGetVotingList.map((gauge: any) => {
    const network = gauge.chain.toLowerCase();
    return {
      address: gauge.gauge.address,
      rawData: { ...gauge },
      networkSlug: networkMap[network] || network,
      isKilled: gauge.gauge.isKilled,
      poolExternalId: gauge.id,
      externalCreatedAt: new Date(gauge.gauge.addedTimestamp * 1000),
      childGaugeAddress: gauge.gauge.childGaugeAddress,
    };
  });

  const uniques = [
    ...new Map(
      responseItems.map((item) => [
        `${item.networkSlug}-${item.address}`,
        item,
      ]),
    ).values(),
  ];

  if (response.data.veBalGetVotingList) {
    await addToTable(
      pools,
      uniques.map((gauge) => ({
        externalId: gauge.poolExternalId,
        networkSlug: gauge.networkSlug,
      })),
    );
    await addToTable(gauges, uniques);
  }

  logIfVerbose("Finished Gauges Extraction from API");
}
