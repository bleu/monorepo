import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";

import { Pool } from "./filterPoolInput";

export function filterPoolWithLiveGauge({
  pool,
  onlyVotingGauges,
}: {
  pool: Pool;
  onlyVotingGauges: boolean;
}) {
  if (!pool) return false;

  if (!onlyVotingGauges) return true;

  return POOLS_WITH_LIVE_GAUGES.some(
    (liveGaugePool) => liveGaugePool.id === pool.id,
  );
}
