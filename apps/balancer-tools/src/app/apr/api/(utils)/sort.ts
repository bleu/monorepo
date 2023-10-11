import { PoolStatsData, PoolStatsResults } from "../route";

export enum Order {
  Asc = "asc",
  Desc = "desc",
}

function compareNumbers(a: number, b: number): number {
  return a - b;
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

function createSortFunction(
  sortProperty: keyof PoolStatsData,
  order: Order,
): (a: PoolStatsData, b: PoolStatsData) => number {
  return (a, b) => {
    let valueA = a[sortProperty];
    let valueB = b[sortProperty];

    if (sortProperty === "apr") {
      valueA = a.apr.total;
      valueB = b.apr.total;
    }

    if (valueA == null || Number.isNaN(valueA)) return 1;
    if (valueB == null || Number.isNaN(valueB)) return -1;

    if (typeof valueA === "number" && typeof valueB === "number") {
      return compareNumbers(valueA, valueB) * (order === Order.Asc ? 1 : -1);
    } else {
      return (
        compareStrings(valueA.toString(), valueB.toString()) *
        (order === Order.Asc ? 1 : -1)
      );
    }
  };
}

export function sortPoolStats(
  poolStatsResults: PoolStatsResults,
  sortProperty: keyof PoolStatsData = "apr",
  order: Order = Order.Desc,
): PoolStatsResults {
  const sortedData: { [key: string]: PoolStatsData[] } = {};

  for (const date in poolStatsResults.perDay) {
    const dayData = poolStatsResults.perDay[date];
    const sortFunction = createSortFunction(sortProperty, order);

    const sortedEntries = dayData.sort(sortFunction);

    sortedData[date] = sortedEntries;
  }

  poolStatsResults.average.poolAverage =
    poolStatsResults.average.poolAverage.sort(
      createSortFunction(sortProperty, order),
    );

  return {
    ...poolStatsResults,
    perDay: sortedData,
  };
}

export function limitPoolStats(
  poolStatsResults: {
    perDay: { [key: string]: PoolStatsData[] };
    average: { [key: string]: PoolStatsData[] };
  },
  offset: number = 0,
  limit: number = Infinity,
): {
  perDay: { [key: string]: PoolStatsData[] };
  average: { [key: string]: PoolStatsData[] };
} {
  const limitedPerDay: { [key: string]: PoolStatsData[] } = {};

  for (const date in poolStatsResults.perDay) {
    limitedPerDay[date] = poolStatsResults.perDay[date].slice(
      offset,
      offset + limit,
    );
  }

  const limitedAverage = poolStatsResults.average.poolAverage.slice(
    offset,
    offset + limit,
  );

  return {
    perDay: limitedPerDay,
    average: { poolAverage: limitedAverage },
  };
}
