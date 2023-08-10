import invariant from "tiny-invariant";

import { Pool } from "#/lib/balancer/gauges";
import { DuneGaugeData } from "#/lib/dune";
import { fetcher } from "#/utils/fetcher";

export default async function PoolPctVotesInRound({
  roundId,
  poolId,
}: {
  roundId?: string | string[];
  poolId: string | string[];
}) {
  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(poolId), "poolId cannot be a list");

  const gaugeData = await fetcher<DuneGaugeData[] | { error: string }>(`http://localhost:3000/apr/rounds/${roundId}`, {method: "GET"});

  if ("error" in gaugeData) {
    return <div>{gaugeData.error}</div>;
  }

  const pool = new Pool(poolId);
  const gaugeAddress = pool.gauge?.address;

  const gauge = gaugeData.find((gauge) => gauge.symbol === gaugeAddress);

  if (!gauge?.pct_votes) {
    return <div>Pool {poolId} (gauge {gaugeAddress}) had no votes in round {roundId}</div>
  }

  return <div>
    {poolId} \(gauge {gaugeAddress}\) had {(gauge?.pct_votes * 100).toFixed(2)}% Voted in round {roundId}
  </div>
}
