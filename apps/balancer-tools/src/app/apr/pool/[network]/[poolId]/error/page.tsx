"use client";

import { Pool } from "@bleu-fi/balancer-apr/src/lib/balancer/gauges";
import { formatDateToMMDDYYYY } from "@bleu-fi/utils/date";

import ErrorTemplate from "#/app/apr/(components)/ErrorTemplate";
import { QueryParamsPagesSchema } from "#/app/apr/(utils)/validate";
import { SearchParams } from "#/app/apr/page";

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
  const addedTimestamp = new Pool(poolId).createdAt;

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
