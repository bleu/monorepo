"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { roundId } = useParams();

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl">
      data from round {roundId}
    </div>
  );
}
