"use client";

import { Network } from "@balancer-pool-metadata/shared";

import MetadataAttributesTable from "./(components)/MetadataAttributesTable";

export default function Page({
  params,
}: {
  params: { poolId: `0x${string}`; network: Network };
}) {
  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributesTable
        poolId={params.poolId}
        network={params.network}
      />
    </div>
  );
}
