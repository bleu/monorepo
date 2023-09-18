import { PlotTitle } from "#/components/Plot";
import { fetcher } from "#/utils/fetcher";

import {
  BASE_URL,
  formatDateToMMDDYYYY,
  PoolStatsResults,
} from "../../api/route";
import PoolTokensTable from "./PoolTokensTable";

export default async function PoolTokens({
  poolId,
  startAt,
  endAt,
}: {
  poolId: string;
  startAt: Date;
  endAt: Date;
}) {
  const poolData: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}${
      startAt ? `&startAt=${formatDateToMMDDYYYY(startAt)}` : ""
    }${endAt ? `&endAt=${formatDateToMMDDYYYY(endAt)}` : ""}`,
  );
  return (
    <div>
      <PlotTitle title="Pool Composition" classNames="py-3" />
      <PoolTokensTable
        poolTokensStats={
          poolData.perDay[formatDateToMMDDYYYY(startAt)][0].tokens
        }
        poolNetwork={poolData.perDay[formatDateToMMDDYYYY(startAt)][0].network}
      />
    </div>
  );
}
