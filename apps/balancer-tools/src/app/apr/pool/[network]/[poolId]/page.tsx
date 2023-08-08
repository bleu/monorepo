"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { network, poolId } = useParams();

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl">
      hello from pool {poolId} in network {network}
    </div>
  );
}
