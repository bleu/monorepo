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
  const updatedSearchParams = {
    ...searchParams,
    tokens: searchParams.tokens ? searchParams.tokens.split(",") : undefined,
  };

  const { poolAverage: poolAvgForTable } = await fetchDataForDateRange({
    startDate,
    endDate,
    ...updatedSearchParams,
  });
  return (
    <PoolListTable
      startAt={startDate}
      endAt={endDate}
      initialData={poolAvgForTable}
    />
  );
}
