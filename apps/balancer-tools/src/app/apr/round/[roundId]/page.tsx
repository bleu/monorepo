"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Loading from "#/app/metadata/[network]/pool/[poolId]/loading";
import { Row } from "#/lib/dune";

export default function Page() {
  const [poolsData, setPoolsData] = useState<Row[]>([]);
  const [hasError, setHasError] = useState("");
  const { roundId } = useParams();
  useEffect(() => {
    if (!poolsData.length) {
      const fetchData = async () => {
        const poolsDataRows = await (
          await fetch(`/apr/rounds/${roundId}`)
        ).json();
        if (poolsDataRows instanceof Array) {
          setPoolsData(poolsDataRows);
        } else {
          setHasError(poolsDataRows["error"]);
        }
      };
      fetchData();
    }
  }, [roundId]);

  if (!poolsData.length) {
    return (
      <div className="flex h-full w-full flex-col justify-center rounded-3xl">
        <Loading />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col justify-center rounded-3xl text-white">
        {hasError}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl">
      data from round {roundId}
    </div>
  );
}
