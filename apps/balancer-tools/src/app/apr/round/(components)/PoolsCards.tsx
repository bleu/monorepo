import { networkFor } from "@bleu-balancer-tools/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";

import { Gauge } from "#/lib/balancer/gauges";
import { DuneGaugeData } from "#/lib/dune";
import { fetcher } from "#/utils/fetcher";
import getBaseURL from "#/utils/getBaseURL";

import BALPrice from "../../(components)/BALPrice";
import calculateRoundAPR from "../../(utils)/calculateRoundAPR";
import { getBALPriceByRound } from "../../(utils)/getBALPriceByRound";
import { getPoolRelativeWeight } from "../../(utils)/getRelativeWeight";
import { Round } from "../../(utils)/rounds";

export interface PoolData {
  pct_votes: number;
  symbol: string;
  votes: number;
  apr: number;
}

export function PoolCard({
  data: { symbol },
  roundId,
}: {
  data: DuneGaugeData;
  roundId?: string;
}) {
  // TODO: Decision. Some pools are not going to have gauges associated to them.
  // Or the gauges are not whitelisted yet.
  // We should not display them. Ideally not even fetch them.
  let gauge;
  try {
    gauge = new Gauge(symbol);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }

  return (
    <Link href={`/apr/pool/${networkFor(gauge.network)}/${gauge.pool.id}`}>
      <div className="flex justify-between border border-gray-400 lg:border-gray-400 bg-blue3 rounded p-4 cursor-pointer">
        <div className="">
          <div className="flex justify-between">
            <div className="text-white font-bold text-xl mb-2">
              {gauge.pool.id}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <PoolVotes roundId={roundId} poolId={gauge.pool.id} />
              <PoolAPR roundId={roundId} poolId={gauge.pool.id} />
              <Suspense fallback={"Loading..."}>
                <BALPrice roundId={roundId} />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="text-white flex flex-col justify-center">
          <ChevronRightIcon />
        </div>
      </div>
    </Link>
  );
}

export async function PoolVotes({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  if (!roundId) return null;

  // const data = await fetcher<DuneGaugeData[] | { error: string }>(
  //   `${getBaseURL()}/apr/rounds/${roundId}?poolId=${poolId}`,
  //   { cache: "force-cache" }
  // );

  // if ("error" in data) throw new Error(data.error);

  // const [pool] = data

  const votingShare = await getPoolRelativeWeight(
    poolId,
    Round.getRoundByNumber(roundId).endDate.getTime() / 1000,
  );

  return (
    <p className="text-white leading-none mb-1">
      {/* {(pool.votes).toFixed(2)} votes */}
      {(votingShare * 100).toFixed(2)}% Voted
    </p>
  );
}

export async function PoolAPR({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  // TODO: aggregate historical pool APR when roundId is not provided
  if (!roundId) return null;

  const round = Round.getRoundByNumber(roundId);

  // TODO: get TVL and votingShare from Dune or Subgraph
  const [balPriceUSD, tvl, votingShare] = await Promise.all([
    getBALPriceByRound(round),
    1_100_000,
    getPoolRelativeWeight(poolId, round.endDate.getTime() / 1000),
  ]);

  // eslint-disable-next-line no-console
  console.log({ balPriceUSD, tvl, votingShare });
  const apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD);

  return (
    <p className="text-white leading-none mb-1">
      {apr?.toFixed?.(2)}% APR - {poolId}
    </p>
  );
}

export default async function PoolsCards({ roundId }: { roundId: string }) {
  const poolsData = await fetcher<DuneGaugeData[] | { error: string }>(
    `${getBaseURL()}/apr/rounds/${roundId}`,
    { cache: "force-cache" },
  );

  if ("error" in poolsData) throw new Error(poolsData.error);

  return (
    <div className="space-y-6 w-full">
      {poolsData.map((data) => (
        <PoolCard data={data} roundId={roundId} key={data.symbol} />
      ))}
    </div>
  );
}
