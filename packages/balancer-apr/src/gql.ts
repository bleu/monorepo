/* eslint-disable no-console */
import { logIfVerbose } from "./index";

export async function gql(
  endpoint: string,
  query: string,
  variables = {},
  headers = {},
) {
  logIfVerbose(`Running GraphQL query on ${endpoint}`);

  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  try {
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
    return response.json();
  } catch (e) {
    console.log("err", e);
  }
}
