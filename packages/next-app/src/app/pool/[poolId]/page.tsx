import { MetadataAttributes } from "./(components)/MetadataAttributes";

export default function Page({ params }: { params: { poolId: string } }) {
  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributes poolId={params.poolId} />
    </div>
  );
}
