import { ChevronRightIcon } from "@radix-ui/react-icons";

import { Gauge } from "#/lib/balancer/gauges";
import { DuneGaugeData } from "#/lib/dune";
import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";
import { networkFor } from "@bleu-balancer-tools/utils";
import Link from "next/link";
import { Suspense } from "react";
import BALPrice from "../../(components)/BALPrice";

function PoolCard({
  data: { symbol, pct_votes: pctVotes, votes },
}: {
  data: DuneGaugeData;
}) {
  const gauge = new Gauge(symbol)
  const poolId = gauge.pool.id;

  return (
    <Link href={`/apr/pool/${networkFor(gauge.network)}/${gauge.pool.id}`}>
    <div
      className="flex justify-between border border-gray-400 lg:border-gray-400 bg-blue3 rounded p-4 cursor-pointer"
    >
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
              <BALPrice  />
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

export default async function PoolsCards({
  roundId,
}: {
  roundId:string
}) {
  const poolsData = await fetcher<DuneGaugeData[] | { error: string }>(`http://localhost:3000/apr/rounds/${roundId}`, { cache: "force-cache"});

  if ("error" in poolsData) throw new Error(poolsData.error);

  return (
    <div className="space-y-6 w-full">
      {poolsData.slice(0,1).map((data) => (
        <PoolCard data={data} key={data.symbol}/>
      ))}
    </div>
  );
}
