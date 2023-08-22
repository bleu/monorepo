import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

import { KPI } from "./KPI";

interface CardDetail {
  title: string;
  content: JSX.Element | string;
}

function OverviewCards({ cardsDetails }: { cardsDetails: CardDetail[] }) {
  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 gap-6 w-full grid auto-cols-fr	grid-flow-col">
      {cardsDetails.map((cardDetail) => (
        <Suspense
          key={cardDetail.title}
          fallback={<KPI title="" content={<Spinner size="sm" />} />}
        >
          <KPI title={cardDetail.title} content={cardDetail.content} />
        </Suspense>
      ))}
    </div>
  );
}

export default OverviewCards;
