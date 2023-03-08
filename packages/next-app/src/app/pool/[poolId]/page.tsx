import { MetadataAttribute } from "./MetadataAttribute";

export default function Page({ params }: { params: { poolId: string } }) {
  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttribute poolId={params.poolId} />
    </div>
  );
}
