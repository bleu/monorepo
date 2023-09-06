"use client";

import { Suspense, useState } from "react";

import { PoolStatsData } from "#/app/apr/api/route";
import { Spinner } from "#/components/Spinner";
import { Tabs } from "#/components/Tabs";
import { trimTrailingValues } from "#/lib/utils";

import HistoricalAPRChart from "./HistoricalAPR/HistoricalAPRChart";
import HistoricalSwapFeeChart from "./HistoricalSwapFee/HistoricalSwapFeeChart";
import HistoricalTvlChart from "./HistoricalTVL/HistoricalTvlChart";

export default function HistoricalCharts({
  poolId,
  roundId,
}: {
  poolId: string;
  roundId?: string;
}) {
  const charts = ["Historical APR", "Weekly Swap Fees (USD)", "Historical TVL"];

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 w-full">
      <Tabs
        defaultValue={String(0)}
        value={String(selectedTab)}
        classNames="bg-transparent  text-slate10"
      >
        <Tabs.ItemTriggerWrapper>
          {charts.map((tabTitle, idx) => (
            <Tabs.ItemTrigger
              tabName={String(idx)}
              key={idx}
              classNames="bg-blue6"
              onClick={() => setSelectedTab(idx)}
            >
              <span>{tabTitle}</span>
            </Tabs.ItemTrigger>
          ))}
        </Tabs.ItemTriggerWrapper>
        <div className="flex justify-between bg-blue3 rounded p-4 cursor-pointer z-50 min-h-[550px]">
          <Tabs.ItemContent tabName={"0"} classNames="bg-blue3">
            <Suspense fallback={<Spinner />}>
              <HistoricalAPRChart poolId={poolId} roundId={roundId} />
            </Suspense>
          </Tabs.ItemContent>
          <Tabs.ItemContent tabName={"1"} classNames="bg-blue3">
            <Suspense fallback={<Spinner />}>
              <HistoricalSwapFeeChart poolId={poolId} roundId={roundId} />
            </Suspense>
          </Tabs.ItemContent>
          <Tabs.ItemContent tabName={"2"} classNames="bg-blue3">
            <Suspense fallback={<Spinner />}>
              <HistoricalTvlChart poolId={poolId} roundId={roundId} />
            </Suspense>
          </Tabs.ItemContent>
        </div>
      </Tabs>
    </div>
  );
}

export function generateAndTrimAprCords(
  data: PoolStatsData[],
  getValue: (result: PoolStatsData) => number,
  valueToTrim: number,
): { x: (string | number)[]; y: (string | number)[] } {
  const cords = Object.entries(data).reduce(
    (cords, [_, result]) => {
      cords.x.push(getRoundName(result.roundId));
      cords.y.push(getValue(result));
      return cords;
    },
    { x: [], y: [] } as { x: string[]; y: number[] },
  );

  const trimmedData = trimTrailingValues(
    cords.x.reverse(),
    cords.y.reverse(),
    valueToTrim,
  );
  return {
    x: trimmedData.trimmedIn,
    y: trimmedData.trimmedOut,
  };
}

export const getRoundName = (roundId?: string | number) =>
  roundId !== undefined ? `#${roundId}` : "#";
