import { ChevronRightIcon } from "@radix-ui/react-icons";

import { formatNumber } from "#/utils/formatNumber";

export default function PoolCard({ symbol, pctVotes, numVotes }) {
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
              {pctVotes.toFixed(0)}% Voted
            </p>
            <p className="text-white text-xs">{formatNumber(numVotes)} Votes</p>
          </div>
        </div>
      </div>
      <div className="text-white flex flex-col justify-center">
        <ChevronRightIcon />
      </div>
    </div>
  );
}
