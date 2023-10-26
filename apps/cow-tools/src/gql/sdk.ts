import { GraphQLClient } from "graphql-request";

import { getSdk } from "#/gql/generated";

export const ENDPOINT = "https://milkman-api.up.railway.app/";

const client = new GraphQLClient(ENDPOINT);

export const sdk = getSdk(client);
