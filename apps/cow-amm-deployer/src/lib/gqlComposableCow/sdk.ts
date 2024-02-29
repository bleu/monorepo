import { GraphQLClient } from "graphql-request";

import { getSdk } from "#/lib/gqlComposableCow/generated";

export const ENDPOINT = "https://composable-cow-api.up.railway.app";

const client = new GraphQLClient(ENDPOINT);

export const composableCowApi = getSdk(client);
