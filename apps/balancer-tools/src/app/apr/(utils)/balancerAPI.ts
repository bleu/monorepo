const BALANCER_GRAPHQL_API_URL: string = "https://api.balancer.fi/graphql";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  // This value is in Balancer's frontend-v2 repo, which is open source
  "x-api-key": "da2-7a3ukmnw7bexndpx5x522uafui",
};

export default class BalancerAPI {
  private static readonly POOLS_QUERY: string = `
    query ($orderDirection: String, $orderBy: String, $chainId: Int!, $poolIds: [String]) {
        pools(
        chainId: $chainId,
        orderBy: $orderBy,
        orderDirection: $orderDirection,
        where: {
            totalShares: { gt: 0.00001 },
            id: { in: $poolIds },
            poolType: {
            not_in: [
                "Element",
                "AaveLinear",
                "EulerLinear",
                "GearboxLinear",
                "Linear",
                "ERC4626Linear",
                "Gyro2",
                "Gyro3",
                "GyroE",
                "HighAmpComposableStable"
            ],
            }
        }
        ) {
        pools {
            symbol
            totalLiquidity
            volumeSnapshot
            createTime
            apr {
            min
            max
            }
        }
        }
    }`;

  public async getPoolsData(
    sortBy: string = "apr",
    chainId: number = 1,
    poolId: string,
  ) {
    const variables = {
      orderBy: sortBy,
      orderDirection: "desc",
      chainId: chainId,
      ...(poolId ? { poolId: poolId } : {}),
    };

    return gql(
      BALANCER_GRAPHQL_API_URL,
      BalancerAPI.POOLS_QUERY,
      variables,
      DEFAULT_HEADERS,
    );
  }

  public static async getPoolTotalLiquidityUSD(chainId = 1, poolId: string) {
    const data = await gql(
      BALANCER_GRAPHQL_API_URL,
      BalancerAPI.POOLS_QUERY,
      {
        poolIds: [poolId],
        chainId,
        sortBy: "totalLiquidity",
        orderDirection: "desc",
      },
      DEFAULT_HEADERS,
    );

    return data?.pools?.pools?.[0]?.totalLiquidity;
  }
}

export async function gql(
  url: string,
  query: string,
  variables: unknown,
  headers: Record<string, string>,
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
  }
}
