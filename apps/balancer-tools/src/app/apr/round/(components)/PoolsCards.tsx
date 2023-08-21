import { networkFor } from "@bleu-balancer-tools/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";
import votingGauges from "#/data/voting-gauges.json";
import { Pool } from "#/lib/balancer/gauges";
import { formatNumber } from "#/utils/formatNumber";

import BALPrice from "../../(components)/BALPrice";
import { calculatePoolStats } from "../../(utils)/calculatePoolStats";

export async function PoolCard({
  network,
  poolId,
  roundId,
}: {
  poolId: string;
  network?: number;
  roundId: string;
}) {
  // TODO: Decision. Some pools are not going to have gauges associated to them.
  // Or the gauges are not whitelisted yet.
  // We should not display them. Ideally not even fetch them.
  const pool = new Pool(poolId);

  const { apr, votingShare } = await calculatePoolStats({ poolId, roundId });

  return (
    <Link href={`/apr/pool/${networkFor(network)}/${pool.id}`}>
      <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4 cursor-pointer">
        <div className="">
          <div className="flex justify-between">
            <div className="text-white font-bold text-xl mb-2">{pool.id}</div>
          </div>
          <Suspense fallback={<Spinner size="sm" />}>
            <div className="flex items-start text-sm flex-col gap-y-[1px]">
              <span>
                {formatNumber(votingShare * 100).concat("%") + " Voted"}
              </span>
              <span>{formatNumber(apr).concat("%") + " APR"}</span>
              <BALPrice roundId={roundId} />
            </div>
          </Suspense>
        </div>
        <div className="text-white flex flex-col justify-center">
          <ChevronRightIcon />
        </div>
      </div>
    </Link>
  );
}

export default async function PoolsCards({ roundId }: { roundId: string }) {
  return (
    <div className="w-full gap-3 flex flex-col">
      {votingGauges.slice(0, 10).map((gauge) => (
        <PoolCard
          poolId={gauge.pool.id}
          network={gauge.network}
          roundId={roundId}
          key={gauge.address}
        />
      ))}
    </div>
  );
}
