import { and, eq, inArray, ne, sql } from "drizzle-orm";

import { db } from "./db/index";
import {
  pools,
  poolTokenRateProviders,
  poolTokenRateProvidersSnapshot,
  poolTokens,
  poolTokenWeightsSnapshot,
  tokenPrices,
} from "./db/schema";
import { addToTable } from "./index";

export async function calculateTokenWeightSnapshots() {
  const tokensFromRateProvider = await db
    .selectDistinct({
      tokenAddress: poolTokenRateProviders.tokenAddress,
      rateProviderAddress: poolTokenRateProvidersSnapshot.rateProviderAddress,
      poolExternalId: poolTokenRateProviders.poolExternalId,
    })
    .from(poolTokenRateProvidersSnapshot)
    .leftJoin(
      poolTokenRateProviders,
      eq(
        poolTokenRateProviders.address,
        poolTokenRateProvidersSnapshot.rateProviderAddress,
      ),
    )
    .leftJoin(
      pools,
      eq(pools.externalId, poolTokenRateProviders.poolExternalId),
    )
    .where(ne(pools.poolType, "Weighted"));

  const poolsIds = tokensFromRateProvider.map(
    ({ poolExternalId }) => poolExternalId as string,
  );

  const tokensAddresses = tokensFromRateProvider.map(
    ({ tokenAddress }) => tokenAddress as string,
  );

  const tokensfromPools = await db
    .select({
      tokenIndex: poolTokens.tokenIndex,
      tokenAddress: poolTokens.tokenAddress,
      poolExternalId: poolTokens.poolExternalId,
      externalCreatedAt: pools.externalCreatedAt,
    })
    .from(poolTokens)
    .leftJoin(pools, eq(pools.externalId, poolTokens.poolExternalId))
    .where(
      and(
        inArray(poolTokens.poolExternalId, poolsIds),
        ne(poolTokens.tokenAddress, pools.address),
      ),
    );

  const tokensGroupedByPool: {
    poolExternalId: string;
    externalCreatedAt: Date;
    tokens: {
      tokenIndex: number;
      tokenAddress: string;
    }[];
  }[] = tokensfromPools.reduce(
    (
      result: {
        poolExternalId: string;
        externalCreatedAt: Date;
        tokens: {
          tokenIndex: number;
          tokenAddress: string;
        }[];
      }[],
      item,
    ) => {
      const existingGroup = result.find(
        (group) => group.poolExternalId === item.poolExternalId,
      );

      if (existingGroup) {
        existingGroup.tokens.push({
          tokenIndex: item.tokenIndex as number,
          tokenAddress: item.tokenAddress as string,
        });
      } else {
        result.push({
          poolExternalId: item.poolExternalId as string,
          externalCreatedAt: item.externalCreatedAt as Date,
          tokens: [
            {
              tokenIndex: item.tokenIndex as number,
              tokenAddress: item.tokenAddress as string,
            },
          ],
        });
      }

      return result;
    },
    [],
  );

  const tokensPricesExists = await db
    .selectDistinct({
      tokenAddress: tokenPrices.tokenAddress,
    })
    .from(tokenPrices)
    .where(and(inArray(tokenPrices.tokenAddress, tokensAddresses)));

  const poolsWithTokenPrices = tokensGroupedByPool.filter((group) =>
    group.tokens.every((token) =>
      tokensPricesExists.some(
        ({ tokenAddress }) => tokenAddress === token.tokenAddress,
      ),
    ),
  );

  const poolExternalIds = poolsWithTokenPrices.map(
    ({ poolExternalId }) => poolExternalId,
  );
  const weightResults: {
    timestamp: Date;
    token: string;
    pool_external_id: string;
    token_index: number;
    value: string;
    total_liquidity: string;
    weight: string;
  }[] = await db.execute(sql`
  WITH distinct_rate_providers AS (
    SELECT DISTINCT pool_rate_providers.address
    FROM pool_rate_providers
  ),
  token_values AS (
    SELECT DISTINCT ON (ps.timestamp, ps.pool_external_id, pt.token_address)
      ps.timestamp,
      pt.token_address AS token,
      ps.pool_external_id,
      (ps.amounts->>pt.token_index)::NUMERIC as amount,
      pt.token_index,
      tp.price_usd,
      CAST(tp.price_usd AS NUMERIC) * (ps.amounts->>pt.token_index)::NUMERIC AS value
    FROM pool_snapshots as ps
      LEFT JOIN pool_rate_providers ON pool_rate_providers.pool_external_id = ps.pool_external_id
      LEFT JOIN pools p ON p.external_id = ps.pool_external_id
      LEFT JOIN blocks b ON b.network_slug = p.network_slug AND b.timestamp = ps.timestamp
      LEFT JOIN pool_tokens pt ON ps.pool_external_id = pt.pool_external_id
      LEFT JOIN token_prices tp ON pt.token_address = tp.token_address AND ps."timestamp" = tp."timestamp"
    WHERE
    ps.pool_external_id IN (${sql.raw(
      poolExternalIds.map((id) => `'${id}'`).join(", "),
    )})
      AND tp.price_usd IS NOT NULL
      AND (ps.amounts->>pt.token_index) IS NOT NULL
  ),
  total_liquidity AS (
    SELECT
      tv.pool_external_id,
      tv.timestamp,
      SUM(tv.value) AS total_liquidity
    FROM token_values tv
    GROUP BY tv.pool_external_id, tv.timestamp
  )
  SELECT
    tv.timestamp,
    tv.token,
    tv.pool_external_id,
    tv.token_index,
    tv.value,
    tl.total_liquidity,
    tv.value / tl.total_liquidity AS weight
  FROM token_values tv
  JOIN total_liquidity tl ON tv.pool_external_id = tl.pool_external_id AND tv.timestamp = tl.timestamp
  WHERE tl.total_liquidity > 0
`);

  await addToTable(
    poolTokenWeightsSnapshot,
    weightResults.map((item) => {
      const utcMidnightTimestampOfCurrentDay = new Date(
        Date.UTC(
          item.timestamp.getUTCFullYear(),
          item.timestamp.getUTCMonth(),
          item.timestamp.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      );
      return {
        timestamp: utcMidnightTimestampOfCurrentDay,
        tokenAddress: item.token,
        poolExternalId: item.pool_external_id,
        weight: item.weight,
        externalId: `${item.pool_external_id}-${
          item.token
        }-${utcMidnightTimestampOfCurrentDay.toISOString()}`,
      };
    }),
  );
}
