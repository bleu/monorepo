/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

async function gql(endpoint, query, variables = {}, headers = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

const ENDPOINT = "https://api-v3.balancer.fi/graphql";

const VOTING_GAUGES_QUERY = `
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

async function main() {
  const response = await gql(ENDPOINT, VOTING_GAUGES_QUERY);
  const votingGauges = response.data.veBalGetVotingList;
  fs.writeFileSync("src/data/voting-gauges.json", JSON.stringify(votingGauges));
}

main();
