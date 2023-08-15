import * as balEmissions from "#/lib/balancer/emissions";
import { formatDateToAmerican } from "#/utils/formatDate";
import { formatNumber } from "#/utils/formatNumber";

import BALPrice from "../../(components)/BALPrice";
import { Round } from "../../(utils)/rounds";

function RoundOverviewCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex flex-col bg-blue6 rounded py-6 px-8 items-center">
      <div className="">{title}</div>
      <div className="pt-2">{content}</div>
    </div>
  );
}

export default async function RoundOverviewCards({
  roundId,
}: {
  roundId: string;
}) {
  const round = Round.getRoundByNumber(roundId);
  const cardsDetails = [
    { title: "Total votes", content: "8.751k" }, // TODO: get this data from the subgraph
    { title: "BAL Price", content: await BALPrice({ roundId }) },
    {
      title: "BAL Emissions",
      content: formatNumber(
        balEmissions.weekly(round.endDate.getTime() / 1000),
      ),
    },
    { title: "Round Started", content: formatDateToAmerican(round.startDate) },
    { title: "Round Ended", content: formatDateToAmerican(round.endDate) },
  ];
  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4">
      <div className="flex justify-evenly w-full">
        {cardsDetails.map((cardsDetail) => (
          <RoundOverviewCard
            title={cardsDetail.title}
            content={cardsDetail.content}
          />
        ))}
      </div>
    </div>
  );
}
