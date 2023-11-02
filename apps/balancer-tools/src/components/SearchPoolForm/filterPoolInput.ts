import { PoolsWherePoolTypeQuery } from "@bleu-fi/gql/src/balancer/__generated__/Ethereum";

import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import { isValuePresent } from "./isValuePresent";

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type Pool = ArrElement<GetDeepProp<PoolsWherePoolTypeQuery, "pools">>;

interface FilterPoolInputProps {
  poolSearchQuery: string;
  pool?: Pool;
}

export default function filterPoolInput({
  poolSearchQuery,
  pool,
}: FilterPoolInputProps): boolean {
  if (!poolSearchQuery) return true;
  if (!pool) return false;

  const searchValues = poolSearchQuery.split(/\s+/);

  for (const searchValue of searchValues) {
    const escapedQuery = escapeRegExp(searchValue.trim());
    const regex = new RegExp(escapedQuery, "i");
    let valueMatched = false;

    for (const value of Object.values(pool)) {
      if (isValuePresent(value, regex)) {
        valueMatched = true;
        break;
      }
    }

    if (!valueMatched) {
      return false;
    }
  }

  return true;
}
