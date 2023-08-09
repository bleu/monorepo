import { Suspense } from "react";

import BALPrice from "../../(components)/BALPrice";

export default async function Page({
  params,
}: {
  params: { roundId: string };
}) {
  const { roundId } = params;

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl text-white">
      <div>data from round {params.roundId}</div>
      <Suspense fallback={"Loading..."}>
        <BALPrice roundId={roundId} />
      </Suspense>
    </div>
  );
}
