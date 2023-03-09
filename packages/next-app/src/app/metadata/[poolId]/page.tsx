"use client";
import metadataGql from "../../../lib/poolMetadataGql";

export default function Page({ params }: { params: { poolId: string } }) {
  const { data: pools } = metadataGql.useMetadataPool({
    poolId: params.poolId,
  });

  const metadataPool = pools?.pools[0];

  return (
    <div className="h-full flex-1 py-5 text-white">
      <div>Pool</div>
      <div>
        <pre>{JSON.stringify(metadataPool, null, 2)}</pre>
      </div>
      metadataCID is an image...
      <img
        src={`https://gateway.pinata.cloud/ipfs/${metadataPool?.metadataCID}`}
      />
      {/* // TODO: PIN a JSON and update the PoolMetadata */}
    </div>
  );
}
