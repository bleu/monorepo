import { BASE_URL, PoolStatsData, PoolStatsResults } from "#/app/apr/api/route";
import { trimTrailingValues } from "#/lib/utils";
import { fetcher } from "#/utils/fetcher";

import HistoricalChart from "./HistoricalChart";

export default async function HistoricalCharts({
  poolId,
  roundId,
}: {
  poolId: string;
  roundId?: string;
}) {
  const results: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}&sort=roundId`,
  );

  return <HistoricalChart apiResult={results} roundId={roundId} />;
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
