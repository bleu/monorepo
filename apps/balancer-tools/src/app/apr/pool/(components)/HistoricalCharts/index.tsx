import {
  PoolStatsData,
  PoolStatsResults,
  PoolStatsResultsPerDay,
} from "#/app/apr/api/route";

import HistoricalChart from "./HistoricalChart";

export default async function HistoricalCharts({
  results,
}: {
  results: PoolStatsResults;
}) {
  return <HistoricalChart results={results} />;
}

export function generateAprCords(
  data: PoolStatsResultsPerDay[], // Use Record<string, PoolStatsData[]> for the updated data format
  getValue: (result: PoolStatsData) => number,
) {
  const { x, y } = data.reduce(
    (acc, result) => {
      const xValues = Object.keys(result)[0];
      const yValues = getValue(Object.values(result)[0]);

      acc.x.push(xValues);
      acc.y.push(yValues);

      return acc;
    },
    { x: [], y: [] } as { x: string[]; y: number[] },
  );

  return {
    x,
    y,
  };
}

export const getRoundName = (roundId?: string | number) =>
  roundId !== undefined ? `#${roundId}` : "#";
