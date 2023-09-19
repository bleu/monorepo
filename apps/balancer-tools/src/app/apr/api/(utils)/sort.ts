import { PoolStatsData, PoolStatsResults } from "../route";

export enum Order {
  Asc = "asc",
  Desc = "desc",
}

function compareNumbers(a: number, b: number, order: Order): number {
  // Handle NaN values
  if (isNaN(a) && isNaN(b)) return 0;
  if (isNaN(a)) return 1;
  if (isNaN(b)) return -1;

  return order === "asc" ? a - b : b - a;
}

function compareStrings(a: string, b: string, order: Order): number {
  return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
}

export function sortAndLimit(
  poolStatsResults: PoolStatsResults,
  sortProperty: keyof PoolStatsData = "apr",
  order: Order = Order.Desc,
  offset: number = 0,
  limit: number = Infinity,
): PoolStatsResults {
  const sortedData: Record<string, PoolStatsData[]> = {};

  for (const date in poolStatsResults.perDay) {
    const dayData = poolStatsResults.perDay[date];

    const sortedEntries = dayData
      .sort((a, b) => {
        const valueA = a[sortProperty];
        const valueB = b[sortProperty];

        if (valueA == null || Number.isNaN(valueA)) return 1;
        if (valueB == null || Number.isNaN(valueB)) return -1;

        if (typeof valueA === "number" && typeof valueB === "number") {
          return compareNumbers(valueA, valueB, order);
        } else {
          return compareStrings(valueA.toString(), valueB.toString(), order);
        }
      })
      .slice(offset, offset + limit);

    sortedData[date] = sortedEntries;
  }

  return {
    ...poolStatsResults,
    perDay: sortedData,
  };
}
