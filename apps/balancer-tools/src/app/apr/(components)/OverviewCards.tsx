import { KPI } from "./KPI";

interface CardDetail {
  title: string;
  content: JSX.Element | string;
}

function OverviewCards({ cardsDetails }: { cardsDetails: CardDetail[] }) {
  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 gap-6 w-full grid auto-cols-fr	grid-flow-col">
      {cardsDetails.map((cardDetail) => (
        <KPI
          title={cardDetail.title}
          content={cardDetail.content}
          key={cardDetail.title}
        />
      ))}
    </div>
  );
}

export default OverviewCards;
