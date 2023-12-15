import { GraphQLClient } from "graphql-request";

import { getSdk } from "#/lib/gql/generated";

export const ENDPOINT = "http://localhost:42069/";

const client = new GraphQLClient(ENDPOINT);

export const milkmanSubgraph = getSdk(client);
