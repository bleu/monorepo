import { PoolsWherePoolTypeQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";

import { ArrElement, GetDeepProp } from "#/utils/getTypes";

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Pool = ArrElement<GetDeepProp<PoolsWherePoolTypeQuery, "pools">>;

function isValuePresent(
  value: string | Pool["tokens"],
  regex: RegExp,
): boolean {
  if (typeof value === "string" && regex.test(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      for (const subValue of Object.values(item)) {
        if (typeof subValue === "string" && regex.test(subValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

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
