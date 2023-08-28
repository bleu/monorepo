import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";

import { Pool } from "./filterPoolInput";
import { filterPoolWithLiveGauge } from "./filterPoolWithLiveGauge";

describe("filterPoolWithLiveGauge", () => {
  it("returns true if onlyVotingGauges is false regardless of the pool", () => {
    const mockPool = { id: "12345" };
    const result = filterPoolWithLiveGauge({
      pool: mockPool as Pool,
      onlyVotingGauges: false,
    });
    expect(result).toBeTruthy();
  });

  it("returns true if the pool id is found in POOLS_WITH_LIVE_GAUGES and onlyVotingGauges is true", () => {
    const mockPool = { id: POOLS_WITH_LIVE_GAUGES[0].id };
    const result = filterPoolWithLiveGauge({
      pool: mockPool as Pool,
      onlyVotingGauges: true,
    });
    expect(result).toBeTruthy();
  });

  it("returns false if the pool id is not found in POOLS_WITH_LIVE_GAUGES and onlyVotingGauges is true", () => {
    const mockPool = { id: "nonExistentId" };
    const result = filterPoolWithLiveGauge({
      pool: mockPool as Pool,
      onlyVotingGauges: true,
    });
    expect(result).toBeFalsy();
  });
});
