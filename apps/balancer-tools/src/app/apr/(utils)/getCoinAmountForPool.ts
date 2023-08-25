import { Pool } from "#/lib/balancer/gauges";
import { poolSnapshots } from "#/lib/gql/server";

const DAY_IN_SECONDS = 24 * 60 * 60;

export default async function getTokenAmountByPoolTimestamp(
  poolId: string,
  timestamp: number = Date.now() / 1000,
) {
  const pool = new Pool(poolId);
  const data = await poolSnapshots.gql(String(pool.network)).PoolSnaphot({
    pool: poolId,
    timestamp: timestamp - DAY_IN_SECONDS,
  });

  return data.poolSnapshots[0].amounts;
}
