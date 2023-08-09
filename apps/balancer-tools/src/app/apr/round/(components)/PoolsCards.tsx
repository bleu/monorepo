import { ChevronRightIcon } from "@radix-ui/react-icons";

import { DunePoolData } from "#/lib/dune";
import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";


function PoolCard({
  data: { symbol, pct_votes: pctVotes, votes },
}: {
  data: DunePoolData;
}) {
  return (
    <div
      key={symbol}
      className="flex justify-between border border-gray-400 lg:border-gray-400 bg-blue3 rounded p-4 cursor-pointer"
    >
      <div className="">
        <div className="flex justify-between">
          <div className="text-white font-bold text-xl mb-2">{symbol}</div>
        </div>
        <div className="flex items-center">
          <div className="text-sm">
            <p className="text-white leading-none mb-1">
              {pctVotes.toFixed(2)}% Voted
            </p>
            <p className="text-white text-xs">{formatNumber(votes)} Votes</p>
          </div>
        </div>
      </div>
      <div className="text-white flex flex-col justify-center">
        <ChevronRightIcon />
      </div>
    </div>
  );
}

export default async function PoolsCards({
  data,
}: {
  data: ReturnType<typeof fetcher<DunePoolData[] | { error: string }>>;
}) {
  const poolsData = await data;

  if ("error" in poolsData) throw new Error(poolsData.error);

  return (
    <div className="space-y-6 w-full">
      {poolsData.map((poolData) => (
        <PoolCard data={poolData} />
      ))}
    </div>
  );
}
