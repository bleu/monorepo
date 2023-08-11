import { networkFor } from "@bleu-balancer-tools/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import { Gauge } from "#/lib/balancer/gauges";
import { DuneGaugeData } from "#/lib/dune";
import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";

import BALPrice from "../../(components)/BALPrice";

function PoolCard({
  data: { symbol, pct_votes: pctVotes, votes },
  roundId,
}: {
  data: DuneGaugeData;
  roundId?: string;
}) {
  const gauge = new Gauge(symbol);
  const poolId = gauge.pool.id;

  return (
    <Link href={`/apr/pool/${networkFor(gauge.network)}/${gauge.pool.id}`}>
      <div className="flex justify-between border border-gray-400 lg:border-gray-400 bg-blue3 rounded p-4 cursor-pointer">
        <div className="">
          <div className="flex justify-between">
            <div className="text-white font-bold text-lg mb-2">{poolId}</div>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-white leading-none mb-1">
                {(pctVotes * 100).toFixed(2)}% Voted
              </p>
              <p className="text-white text-xs">{formatNumber(votes)} Votes</p>
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

const getBaseURL = () => {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";

  return `${protocol}://${host}`;
};

export default async function PoolsCards({ roundId }: { roundId: string }) {
  const poolsData = await fetcher<DuneGaugeData[] | { error: string }>(
    `${getBaseURL()}/apr/rounds/${roundId}`,
    { cache: "force-cache" },
  );

  if ("error" in poolsData) throw new Error(poolsData.error);

  return (
    <div className="space-y-6 w-full">
      {poolsData.slice(0, 1).map((data) => (
        <PoolCard data={data} roundId={roundId} key={data.symbol} />
      ))}
    </div>
  );
}
