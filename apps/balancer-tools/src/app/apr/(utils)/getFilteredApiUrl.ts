import { networkFor } from "@bleu-balancer-tools/utils";

import { Pool } from "#/lib/balancer/gauges";

import { formatDateToMMDDYYYY } from "../api/(utils)/date";
import { SearchParams } from "../page";
import { BASE_URL } from "./types";

export const INITIAL_MIN_TVL = 1000;
export const INITIAL_LIMIT = 10;

interface ExpectedSearchParams extends SearchParams {
  minTVL?: string;
  limit?: string;
  sort?: string;
  order?: string;
}

const convert = (key: string, value: string) => {
  if (["sort", "order"].includes(key)) return value || undefined;
  if (["minTVL", "maxTVL", "minAPR", "maxAPR", "limit"].includes(key))
    return Number(value) || undefined;
  if (["tokens", "type", "network"].includes(key))
    return value ? value.split(",") : undefined;
  return value;
};

function getFilterDataFromParams(searchParams: SearchParams) {
  const {
    minTVL = INITIAL_MIN_TVL,
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
    minTVL,
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

export function generateApiUrlWithParams(
  startAt: Date,
  endAt: Date,
  searchParams?: SearchParams | null,
  poolId?: string,
) {
  const queryParams = generateQueryParams(startAt, endAt, searchParams);
  return `${BASE_URL}/apr/api?${queryParams}${
    poolId ? `&poolId=${poolId}` : ""
  }`;
}

export function generateRedirectUrlWithParams(
  startAt: Date,
  endAt: Date,
  searchParams?: SearchParams | null,
  poolId?: string,
) {
  const queryParams = generateQueryParams(startAt, endAt, searchParams);
  if (poolId) {
    const network = networkFor(new Pool(poolId).network);
    return `apr/pool/${network}/${poolId}?startAt=${formatDateToMMDDYYYY(
      startAt,
    )}&endAt=${formatDateToMMDDYYYY(endAt)}`;
  } else {
    return `/apr?${queryParams}`;
  }
}
