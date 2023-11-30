import { fetchDataForDateRange } from "../(utils)/fetchForDateRange";
import { SearchParams } from "../page";
import { PoolListTable } from "./PoolListTable";

export default async function PoolListTableWrapper({
  startDate,
  endDate,
  searchParams,
}: {
  startDate: Date;
  endDate: Date;
  searchParams: SearchParams;
}) {
  const { poolAverage: poolAvgForTable } = await fetchDataForDateRange({
    startDate,
    endDate,
    ...searchParams,
    filteredTokens: searchParams.tokens?.split(","),
  });
  return (
    <PoolListTable
      startAt={startDate}
      endAt={endDate}
      initialData={poolAvgForTable}
    />
  );
}
