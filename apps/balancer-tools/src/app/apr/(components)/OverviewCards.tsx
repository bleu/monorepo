import { formatDate } from "@bleu-balancer-tools/utils";

import { KPI } from "./KPI";

interface CardDetail {
  title: string;
  content: JSX.Element | string;
  tooltip?: string;
}

export function getDatesDetails(startAt: Date, endAtDate: Date) {
  return [
    {
      title: "Selected Dates",
      content: `${formatDate(startAt)} - ${formatDate(endAtDate)}`,
    },
  ];
}

function OverviewCards({ cardsDetails }: { cardsDetails: CardDetail[] }) {
  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 gap-6 w-full grid auto-rows-fr sm:auto-cols-fr sm:grid-flow-col">
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
