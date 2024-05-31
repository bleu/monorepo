import { dateToEpoch } from "@bleu/utils/date";
import { and, eq, gt, isNotNull, sql, sum } from "drizzle-orm";
import { addToTable } from "lib/db/addToTable";

import { db } from "../../../db/index";
import {
  blocks,
  poolSnapshots,
  poolTokenRateProviders,
  poolTokens,
  poolTokenWeightsSnapshot,
  tokenPrices,
} from "../../../db/schema";

export async function calculateTokenWeightSnapshots() {
  // const tokensFromRateProvider = await db
  //   .selectDistinct({
  //     tokenAddress: poolTokenRateProviders.tokenAddress,
  //     rateProviderAddress: poolTokenRateProvidersSnapshot.rateProviderAddress,
  //     poolExternalId: poolTokenRateProviders.poolExternalId,
  //   })
  //   .from(poolTokenRateProvidersSnapshot)
  //   .leftJoin(
  //     poolTokenRateProviders,
  //     eq(
  //       poolTokenRateProviders.address,
  //       poolTokenRateProvidersSnapshot.rateProviderAddress
  //     )
  //   )
  //   .leftJoin(
  //     pools,
  //     eq(pools.externalId, poolTokenRateProviders.poolExternalId)
  //   )
  //   .where();

  // const poolsIds = tokensFromRateProvider.map(
  //   ({ poolExternalId }) => poolExternalId as string,
  // );

  // const tokensAddresses = tokensFromRateProvider.map(
  //   ({ tokenAddress }) => tokenAddress as string,
  // );

  // const tokensfromPools = await db
  //   .select({
  //     tokenIndex: poolTokens.tokenIndex,
  //     tokenAddress: poolTokens.tokenAddress,
  //     poolExternalId: poolTokens.poolExternalId,
  //     externalCreatedAt: pools.externalCreatedAt,
  //   })
  //   .from(poolTokens)
  //   .innerJoin(
  //     poolTokenRateProviders,
  //     and(
  //       eq(poolTokenRateProviders.tokenAddress, poolTokens.tokenAddress),
  //       eq(poolTokenRateProviders.poolExternalId, poolTokens.poolExternalId)
  //     )
  //   )
  //   .innerJoin(pools, eq(pools.externalId, poolTokens.poolExternalId))
  //   .where(
  //     and(
  //       ne(pools.poolType, "Weighted"),
  //       ne(poolTokens.tokenAddress, pools.address)
  //     )
  //   );

  // const tokensGroupedByPool: {
  //   poolExternalId: string;
  //   externalCreatedAt: Date;
  //   tokens: {
  //     tokenIndex: number;
  //     tokenAddress: string;
  //   }[];
  // }[] = tokensfromPools.reduce(
  //   (
  //     result: {
  //       poolExternalId: string;
  //       externalCreatedAt: Date;
  //       tokens: {
  //         tokenIndex: number;
  //         tokenAddress: string;
  //       }[];
  //     }[],
  //     item
  //   ) => {
  //     const existingGroup = result.find(
  //       (group) => group.poolExternalId === item.poolExternalId
  //     );

  //     if (existingGroup) {
  //       existingGroup.tokens.push({
  //         tokenIndex: item.tokenIndex as number,
  //         tokenAddress: item.tokenAddress as string,
  //       });
  //     } else {
  //       result.push({
  //         poolExternalId: item.poolExternalId as string,
  //         externalCreatedAt: item.externalCreatedAt as Date,
  //         tokens: [
  //           {
  //             tokenIndex: item.tokenIndex as number,
  //             tokenAddress: item.tokenAddress as string,
  //           },
  //         ],
  //       });
  //     }

  //     return result;
  //   },
  //   []
  // );

  // const tokensPricesExists = await db
  //   .selectDistinct({
  //     tokenAddress: tokenPrices.tokenAddress,
  //   })
  //   .from(tokenPrices)
  //   .where(and(inArray(tokenPrices.tokenAddress, tokensAddresses)));

  // const poolsWithTokenPrices = tokensGroupedByPool.filter((group) =>
  //   group.tokens.every((token) =>
  //     tokensPricesExists.some(
  //       ({ tokenAddress }) => tokenAddress === token.tokenAddress
  //     )
  //   )
  // );

  // const poolExternalIds = poolsWithTokenPrices.map(
  //   ({ poolExternalId }) => poolExternalId
  // );

  // console.log({ poolExternalIds });

  //   const weightResults: {
  //     timestamp: Date;
  //     token: string;
  //     pool_external_id: string;
  //     token_index: number;
  //     value: string;
  //     total_liquidity: string;
  //     weight: string;
  //   }[] =
  //   await db.execute(sql`
  //   WITH distinct_rate_providers AS (
  //     SELECT DISTINCT pool_rate_providers.address
  //     FROM pool_rate_providers
  //   ),
  //   token_values AS (
  //     SELECT DISTINCT ON (ps.timestamp, ps.pool_external_id, pt.token_address)
  //       ps.timestamp,
  //       pt.token_address AS token,
  //       ps.pool_external_id,
  //       (ps.amounts->>pt.token_index)::NUMERIC as amount,
  //       pt.token_index,
  //       tp.price_usd,
  //       CAST(tp.price_usd AS NUMERIC) * (ps.amounts->>pt.token_index)::NUMERIC AS value
  //     FROM pool_snapshots as ps
  //       LEFT JOIN pool_rate_providers ON pool_rate_providers.pool_external_id = ps.pool_external_id
  //       LEFT JOIN pools p ON p.external_id = ps.pool_external_id
  //       LEFT JOIN blocks b ON b.network_slug = p.network_slug AND b.timestamp = ps.timestamp
  //       LEFT JOIN pool_tokens pt ON ps.pool_external_id = pt.pool_external_id
  //       LEFT JOIN token_prices tp ON pt.token_address = tp.token_address AND ps."timestamp" = tp."timestamp"
  //     WHERE
  //     ps.pool_external_id IN (${sql.raw(
  //       poolExternalIds.map((id) => `'${id}'`).join(", ")
  //     )})
  //       AND tp.price_usd IS NOT NULL
  //       AND (ps.amounts->>pt.token_index) IS NOT NULL
  //   ),
  //   total_liquidity AS (
  //     SELECT
  //       tv.pool_external_id,
  //       tv.timestamp,
  //       SUM(tv.value) AS total_liquidity
  //     FROM token_values tv
  //     GROUP BY tv.pool_external_id, tv.timestamp
  //   )
  //   SELECT
  //     tv.timestamp,
  //     tv.token,
  //     tv.pool_external_id,
  //     tv.token_index,
  //     tv.value,
  //     tl.total_liquidity,
  //     tv.value / tl.total_liquidity AS weight
  //   FROM token_values tv
  //   JOIN total_liquidity tl ON tv.pool_external_id = tl.pool_external_id AND tv.timestamp = tl.timestamp
  //   WHERE tl.total_liquidity > 0
  // `);

  // Define the distinct_rate_providers subquery

  // Define the token_values subquery
  const tokenValues = db
    .selectDistinctOn(
      [
        poolSnapshots.timestamp,
        poolSnapshots.poolExternalId,
        poolTokens.tokenAddress,
      ],
      {
        timestamp: poolSnapshots.timestamp,
        token: poolTokens.tokenAddress,
        poolExternalId: poolSnapshots.poolExternalId,
        amount:
          sql`(pool_snapshots.amounts->>pool_tokens.token_index)::NUMERIC`.as(
            "amount"
          ),
        tokenIndex: poolTokens.tokenIndex,
        priceUsd: tokenPrices.priceUSD,
        value:
          sql`CAST(token_prices.price_usd AS NUMERIC) * (pool_snapshots.amounts->>pool_tokens.token_index)::NUMERIC`.as(
            "value"
          ),
      }
    )
    .from(poolSnapshots)
    .innerJoin(
      poolTokenRateProviders,
      eq(poolTokenRateProviders.poolExternalId, poolSnapshots.poolExternalId)
    )
    .innerJoin(
      blocks,
      and(
        eq(blocks.networkSlug, poolSnapshots.networkSlug),
        eq(blocks.timestamp, poolSnapshots.timestamp)
      )
    )
    .innerJoin(
      poolTokens,
      eq(poolTokens.poolExternalId, poolSnapshots.poolExternalId)
    )
    .innerJoin(
      tokenPrices,
      and(
        eq(tokenPrices.tokenAddress, poolTokens.tokenAddress),
        eq(tokenPrices.timestamp, poolSnapshots.timestamp),
        eq(tokenPrices.networkSlug, poolSnapshots.networkSlug)
      )
    )
    .where(
      and(
        // inArray(poolSnapshots.poolExternalId, poolExternalIds),
        isNotNull(tokenPrices.priceUSD),
        isNotNull(sql`(pool_snapshots.amounts->>pool_tokens.token_index)`)
      )
    )
    .as("token_values");

  // Define the total_liquidity subquery
  const totalLiquidity = db
    .select({
      poolExternalId: tokenValues.poolExternalId,
      timestamp: tokenValues.timestamp,
      totalLiquidity: sum(tokenValues.value).as("total_liquidity"),
    })
    .from(tokenValues)
    .groupBy(tokenValues.poolExternalId, tokenValues.timestamp)
    .as("total_liquidity");

  // Final SELECT query
  const weightResults = await db
    .select({
      timestamp: tokenValues.timestamp,
      token: tokenValues.token,
      poolExternalId: tokenValues.poolExternalId,
      tokenIndex: tokenValues.tokenIndex,
      value: tokenValues.value,
      totalLiquidity: totalLiquidity.totalLiquidity,
      weight: sql`token_values.value / total_liquidity.total_liquidity`,
    })
    .from(tokenValues)
    .innerJoin(
      totalLiquidity,
      and(
        eq(tokenValues.poolExternalId, totalLiquidity.poolExternalId),
        eq(tokenValues.timestamp, totalLiquidity.timestamp)
      )
    )
    .where(gt(totalLiquidity.totalLiquidity, "0"));

  await addToTable(
    poolTokenWeightsSnapshot,
    weightResults
      .map((item) => {
        if (!item.timestamp) return null;

        const utcMidnightTimestampOfCurrentDay = new Date(
          Date.UTC(
            item.timestamp.getUTCFullYear(),
            item.timestamp.getUTCMonth(),
            item.timestamp.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        return {
          timestamp: utcMidnightTimestampOfCurrentDay,
          tokenAddress: item.token,
          poolExternalId: item.poolExternalId,
          weight: item.weight,
          externalId: `${item.poolExternalId}-${item.token}-${dateToEpoch(
            utcMidnightTimestampOfCurrentDay
          )}`,
        };
      })
      .filter(Boolean)
  );
}
