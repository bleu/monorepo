import { BASE_URL } from "../api/route";
import { SearchParams } from "../round/[roundId]/page";

export const INITIAL_MIN_TVL = 1000;
export const INITIAL_LIMIT = 10;

const convert = (key: string, value: string) => {
  if (["sort", "order"].includes(key)) return value || undefined;
  if (["minTVL", "maxTVL", "minAPR", "maxAPR", "limit"].includes(key))
    return Number(value) || undefined;
  if (["tokens", "type", "network"].includes(key))
    return value ? value.split(",") : undefined;
  return value;
};
function getFilterDataFromParams(searchParams: SearchParams) {
  const result = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      convert(key, value),
    ]),
  );

  // Include minTVL and limit if they are not already present in searchParams
  if (!("minTVL" in result)) {
    result.minTVL = INITIAL_MIN_TVL;
  }
  if (!("limit" in result)) {
    result.limit = INITIAL_LIMIT;
  }

  return result;
}
export default function getFilteredRoundApiUrl(
  searchParams: SearchParams,
  roundId: string,
) {
  const filteredData = getFilterDataFromParams(searchParams);
  const params = Object.entries(filteredData)
    .map(([key, value]) => (value !== undefined ? `${key}=${value}` : ""))
    .join("&");
  return `${BASE_URL}/apr/api/?roundId=${roundId}&${params}`;
}
