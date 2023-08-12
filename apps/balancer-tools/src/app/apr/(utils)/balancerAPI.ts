const BALANCER_GRAPHQL_API_URL: string =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
};

export default class BalancerAPI {
  private static readonly POOLS_QUERY: string = `
    query ($id: String) {
      pool(id: $id) {
          totalLiquidity
        }
    }`;

  public static async getPoolTotalLiquidityUSD(_chainId = 1, poolId: string) {
    const { data } = await gql(
      BALANCER_GRAPHQL_API_URL,
      BalancerAPI.POOLS_QUERY,
      {
        id: poolId,
      },
      DEFAULT_HEADERS,
    );

    return Number(data?.pool?.totalLiquidity);
  }
}

export async function gql(
  url: string,
  query: string,
  variables: unknown,
  headers?: Record<string, string>,
) {
  try {
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers,
    });
    return await result.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ error });
    return false;
  }
}
