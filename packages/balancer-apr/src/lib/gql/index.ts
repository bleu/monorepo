/* eslint-disable no-console */

import { logIfVerbose } from "lib/logIfVerbose";

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
    if (!response.ok) {
      console.log("response", response);
      throw new Error(
        `GraphQL query failed with status ${response.status}: ${response.statusText}`,
      );
    }

    const json = await response.json();
    if (json.errors) {
      console.log("json", json);
      throw new Error(`GraphQL query failed: ${json.errors[0].message}`);
    }
    return json;
  } catch (e) {
    console.log("err", e);
    throw e;
  }
}
