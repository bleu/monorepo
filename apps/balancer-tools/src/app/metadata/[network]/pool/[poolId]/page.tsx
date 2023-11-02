import { Address, Network, networkIdFor } from "@bleu/utils";

import { pools, poolsMetadata } from "#/lib/gql/server";

import MetadataAttributesTable from "./(components)/MetadataAttributesTable";

export default async function Page({
  params,
}: {
  params: { poolId: Address; network: Network };
}) {
  const chainId = networkIdFor(params.network);
  const poolId = params.poolId;

  const [poolOwner, metadataRegistry] = await Promise.all([
    pools.gql(chainId).Pool({
      poolId,
    }),
    poolsMetadata.gql(chainId).MetadataPool({
      poolId,
    }),
  ]);

  const pool = metadataRegistry.pools[0];

  let data,
    error = undefined;
  if (pool) {
    const response = await fetch(`https://ipfs.io/ipfs/${pool.metadataCID}`);

    if (response.ok) {
      data = await response.json();
    } else {
      error = response.statusText;
    }
  }

  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributesTable
        poolId={params.poolId}
        network={params.network}
        poolOwner={poolOwner.pool?.owner}
        cid={pool?.metadataCID}
        data={data}
        error={error}
      />
    </div>
  );
}
