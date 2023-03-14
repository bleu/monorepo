import { MetadataAttributesTable } from "./(components)/MetadataAttributesTable";

export default function Page({
  params,
}: {
  params: { poolId: `0x${string}` };
}) {
  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributesTable poolId={params.poolId} />
    </div>
  );
}
