import { db } from "@bleu-fi/balancer-apr/src/db";
import { pools } from "@bleu-fi/balancer-apr/src/db/schema";
import { formatDate } from "@bleu-fi/utils";
import { eq } from "drizzle-orm";

import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { fetchAvgDataForPoolIdDateRange } from "../../(utils)/fetchAvgDataForPoolIdDateRange";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";

export default async function PoolOverviewCards({
  startAt,
  endAt,
  poolId,
}: {
  startAt: Date;
  endAt: Date;
  poolId: string;
}) {
  const cardsDetails: {
    title: string;
    content: JSX.Element | string;
    tooltip?: string;
  }[] = [];

  const results = await fetchAvgDataForPoolIdDateRange(poolId, startAt, endAt);

  if (!results.poolAverage) {
    const poolCreationDateArray = await db
      .select({ creatAt: pools.externalCreatedAt })
      .from(pools)
      .where(eq(pools.externalId, poolId));

    const poolCreationDate = poolCreationDateArray[0].creatAt as Date;
    return (
      <div className="border border-blue6 bg-blue3 rounded p-4  w-full flex items-center flex-col">
        <span>
          Looks like the range you selected extends before the pool was created
        </span>
        <span>
          Please select a date range after {formatDate(poolCreationDate)}
        </span>
      </div>
    );
  }

  cardsDetails.push(
    ...[
      {
        title: "Avg. TVL",
        content: formatTVL(results.poolAverage.avgTvl),
      },
      {
        title: "Avg. Total APR",
        content: formatAPR(results.poolAverage.avgApr),
      },
      ...getDatesDetails(startAt, endAt),
    ],
  );

  return <OverviewCards cardsDetails={cardsDetails} />;
}
