/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENDPOINT_V3 } from "../../../config";
import { gauges } from "../../../db/schema";
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

  if (response.data.veBalGetVotingList) {
    await addToTable(
      gauges,
      response.data.veBalGetVotingList.map((gauge: any) => ({
        address: gauge.gauge.address,
        rawData: { ...gauge },
      })),
    );
  }
}
