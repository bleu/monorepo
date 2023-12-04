import { fetchDataForDateRange } from "../(utils)/fetchForDateRange";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const { poolAverage: poolAvgForChart } = await fetchDataForDateRange({
    startDate,
    endDate,
  });

  return (
    <TopPoolsChart
      startAt={startDate}
      endAt={endDate}
      poolsData={poolAvgForChart}
    />
  );
}
