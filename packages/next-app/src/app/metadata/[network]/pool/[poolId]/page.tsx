import { Network, networkIdFor } from "@balancer-pool-metadata/shared";

import { pools, poolsMetadata } from "#/lib/gql/server";

import MetadataAttributesTable from "./(components)/MetadataAttributesTable";

export default async function Page({
  params,
}: {
  params: { poolId: `0x${string}`; network: Network };
}) {
  const chainId = networkIdFor(params.network);
  const poolId = params.poolId;

  const [poolOwner, metadataRegistry] = await Promise.all([
    pools.gql(chainId).PoolOwner({
      poolId,
    }),
    poolsMetadata.gql(chainId).MetadataPool({
      poolId,
    }),
  ]);

  const pool = metadataRegistry.pools[0];

  const data =
    pool && pool.metadataCID
      ? await fetch(
          `https://bleu.infura-ipfs.io/ipfs/${pool.metadataCID}`
        ).then((res) => res.json())
      : null;

  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributesTable
        poolId={params.poolId}
        network={params.network}
        poolOwner={poolOwner.pool?.owner}
        data={data}
      />
    </div>
  );
}
