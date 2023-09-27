"use client";

import ErrorTemplate from "#/app/apr/(components)/ErrorTemplate";
import { formatDateToMMDDYYYY } from "#/app/apr/api/(utils)/date";
import { QueryParamsPagesSchema } from "#/app/apr/api/(utils)/validate";
import { SearchParams } from "#/app/apr/page";
import { Pool } from "#/lib/balancer/gauges";

export default function PoolError({
  searchParams,
  params: { poolId },
}: {
  searchParams: SearchParams;
  params: { poolId: string };
}) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);

  if (!parsedParams.success) {
    return ErrorTemplate({
      title: "Invalid URL",
      textContent: "Please check the URL and try again",
    });
  }

  const { startAt: startAtDate, endAt: endAtDate } = parsedParams.data;
  const addedTimestamp = new Pool(poolId).gauge.addedTimestamp;

  if (!addedTimestamp) {
    return ErrorTemplate({
      title: "Invalid Pool ID",
      textContent: "Please check the Pool ID and try again",
    });
  }

  const addedDate = new Date(addedTimestamp * 1000);
  if (!startAtDate || !endAtDate) {
    return ErrorTemplate({
      title: "Invalid URL",
      textContent: "Please check the URL and try again",
    });
  }

  return ErrorTemplate({
    title: "Selected date is before pool creation",
    textContent: `There is no data available from  ${formatDateToMMDDYYYY(
      startAtDate,
    )} to  ${formatDateToMMDDYYYY(endAtDate)}.
    Please select a date range after ${formatDateToMMDDYYYY(addedDate)}`,
  });
}
