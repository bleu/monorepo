/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENDPOINT_V3 } from "../../../config";
import { gauges, pools } from "../../../db/schema";
import { gql } from "../../../gql";
import { addToTable, logIfVerbose } from "../../../index";

export const VOTING_GAUGES_QUERY = `
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

export async function extractGauges() {
  logIfVerbose("Starting Gauges Extraction");

  const response = await gql(ENDPOINT_V3, VOTING_GAUGES_QUERY);

  logIfVerbose(`Processing gauges`);

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
}
