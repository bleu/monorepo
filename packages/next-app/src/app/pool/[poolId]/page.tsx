import { MetadataAttributesTable } from "./(components)/MetadataAttributesTable";

export default function Page({ params }: { params: { poolId: string } }) {
  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributesTable poolId={params.poolId as `0x${string}`} />
    </div>
  );
}
