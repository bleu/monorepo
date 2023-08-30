import { formatDate } from "@bleu-balancer-tools/utils";

import { Round } from "../(utils)/rounds";
import { KPI } from "./KPI";

interface CardDetail {
  title: string;
  content: JSX.Element | string;
  tooltip?: string;
}

export function getRoundDetails(roundId: string) {
  const round = Round.getRoundByNumber(roundId);
  return [
    { title: "Round Number", content: roundId },
    {
      title: "Round Ended",
      content: formatDate(round.endDate),
      tooltip: "Every round ends on a Thursday at 00:00 UTC",
    },
  ];
}

function OverviewCards({ cardsDetails }: { cardsDetails: CardDetail[] }) {
  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 gap-6 w-full grid auto-cols-fr	grid-flow-col">
      {cardsDetails.map((cardDetail) => (
        <KPI
          title={cardDetail.title}
          content={cardDetail.content}
          key={cardDetail.title}
          tooltip={cardDetail.tooltip}
        />
      ))}
    </div>
  );
}

export default OverviewCards;
