import { Network } from "@balancer-pool-metadata/balancer-gql/codegen";

import { MetadataAttributesTable } from "./(components)/MetadataAttributesTable";

export default function Page({
  params,
}: {
  params: { poolId: `0x${string}`; network: Network };
}) {
  return (
    <div className="h-screen flex-1 p-5 text-white">
      <MetadataAttributesTable
        poolId={params.poolId}
        network={params.network}
      />
    </div>
  );
}
