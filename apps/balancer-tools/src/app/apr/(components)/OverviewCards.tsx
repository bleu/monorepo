import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

import { KPI } from "./KPI";

interface CardDetail {
  title: string;
  content: JSX.Element | string;
}

function OverviewCards({ cardsDetails }: { cardsDetails: CardDetail[] }) {
  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4">
      <div className="flex flex-row flex-wrap xl:flex-nowrap gap-6 justify-evenly w-full">
        {cardsDetails.map((cardDetail) => (
          <Suspense
            key={cardDetail.title}
            fallback={<KPI title="" content={<Spinner size="sm" />} />}
          >
            <KPI title={cardDetail.title} content={cardDetail.content} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

export default OverviewCards;
