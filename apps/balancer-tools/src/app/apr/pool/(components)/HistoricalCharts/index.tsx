"use client";

import { Suspense, useState } from "react";

import { PoolStatsData } from "#/app/apr/api/route";
import { Spinner } from "#/components/Spinner";
import { Tabs } from "#/components/Tabs";
import { trimTrailingValues } from "#/lib/utils";

import HistoricalAPRChart from "./HistoricalAPR/HistoricalAPRChart";
import HistoricalSwapFeeChart from "./HistoricalSwapFee/HistoricalSwapFeeChart";

export default function HistoricalCharts({
  poolId,
  roundId,
}: {
  poolId: string;
  roundId?: string;
}) {
  const charts = ["APR", "Swap Fee"];

  const [selectedTab, setSelectedTab] = useState(charts[0]);

  function handleTabClick(event: React.FormEvent<HTMLButtonElement>) {
    const target = event.target as HTMLButtonElement;
    setSelectedTab(target.innerText);
  }
  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 w-full">
      <Tabs defaultValue={charts[0]} value={selectedTab}>
        <Tabs.ItemTriggerWrapper>
          {charts.map((chartType) => (
            <Tabs.ItemTrigger
              tabName={chartType}
              key={chartType}
              triggerBgColor="bg-blue6"
              onClick={handleTabClick}
            >
              <span>{chartType}</span>
            </Tabs.ItemTrigger>
          ))}
        </Tabs.ItemTriggerWrapper>
        <Tabs.ItemContent tabName={"APR"} bgColor="bg-blue3">
          <Suspense fallback={<Spinner />}>
            <HistoricalAPRChart poolId={poolId} roundId={roundId} />
          </Suspense>
        </Tabs.ItemContent>
        <Tabs.ItemContent tabName={"Swap Fee"} bgColor="bg-blue3">
          <Suspense fallback={<Spinner />}>
            <HistoricalSwapFeeChart poolId={poolId} roundId={roundId} />
          </Suspense>
        </Tabs.ItemContent>
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
