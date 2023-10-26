async function gql(
  endpoint: RequestInfo | URL,
  query: string,
  variables = {},
  headers = {},
) {
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

const ENDPOINT = "https://milkman-api.up.railway.app/";

const QUERY = `
query AllSwaps {
  swaps {
    id
    chainId
    transactionHash
    priceChecker
    user {
      id
    }
    tokenIn {
      id
    }
    tokenOut{
      id
    }
  }
}`;
export interface Swap {
  id: string;
  chainId: number;
  transactionHash: string;
  priceChecker: string;
  user: {
    id: string;
  };
  tokenIn: {
    id: string;
  };
  tokenOut: {
    id: string;
  };
}

export async function getAllOrders(): Promise<Swap[]> {
  const response = await gql(ENDPOINT, QUERY);
  return response.data.swaps;
}
