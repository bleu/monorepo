import { Pool } from "@bleu/balancer-apr/src/lib/balancer/gauges";
import { networkFor } from "@bleu/utils";
import { formatDateToMMDDYYYY } from "@bleu/utils/date";

import { SearchParams } from "../page";

export const INITIAL_MIN_TVL = 10_000;
export const INITIAL_LIMIT = 10;

interface ExpectedSearchParams extends SearchParams {
  minTvl?: string;
  limit?: string;
  sort?: string;
  order?: string;
}

const convert = (key: string, value: string) => {
  if (["sort", "order"].includes(key)) return value || undefined;
  if (["minTvl", "maxTvl", "minApr", "maxApr", "limit"].includes(key))
    return Number(value) || undefined;
  if (["tokens", "type", "network"].includes(key))
    return value ? value.split(",") : undefined;
  return value;
};

function getFilterDataFromParams(searchParams: SearchParams) {
  const {
    minTvl = INITIAL_MIN_TVL,
    limit = INITIAL_LIMIT,
    sort = "apr",
    order = "desc",
    ...rest
  } = searchParams as ExpectedSearchParams;

  // Convert values for each property if needed
  const convertedParams = Object.fromEntries(
    Object.entries(rest).map(([key, value]) => [key, convert(key, value)]),
  );

  // Merge the converted params with default values
  const result = {
    minTvl,
    limit,
    sort,
    order,
    ...convertedParams,
  };

  return result;
}

function generateQueryParams(
  startAt: Date,
  endAt: Date,
  searchParams?: SearchParams | null,
) {
  const filteredData = getFilterDataFromParams(searchParams ?? {});
  const uniqueKeys = new Set(["startAt", "endAt"]);

  const params = Object.entries(filteredData)
    .filter(([key, value]) => {
      if (uniqueKeys.has(key) || value === undefined) {
        return false;
      }
      uniqueKeys.add(key);
      return true;
    })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `startAt=${formatDateToMMDDYYYY(startAt)}&endAt=${formatDateToMMDDYYYY(
    endAt,
  )}&${params}`;
}

export function generatePoolPageLink(
  startAt: Date,
  endAt: Date,
  searchParams?: SearchParams | null,
  poolId?: string,
  network?: string,
) {
  const queryParams = generateQueryParams(startAt, endAt, searchParams);
  if (poolId) {
    return `/apr/pool/${
      network || networkFor(new Pool(poolId).network)
    }/${poolId}?startAt=${formatDateToMMDDYYYY(
      startAt,
    )}&endAt=${formatDateToMMDDYYYY(endAt)}`;
  } else {
    return `/apr?${queryParams}`;
  }
}
