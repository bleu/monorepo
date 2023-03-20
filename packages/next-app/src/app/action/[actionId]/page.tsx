import { MetadataAttributesTable } from "./(components)/MetadataAttributesTable";

export default function Page({
  params,
}: {
  params: { actionId: string};
}) {
  return (
    <div className="h-full flex-1 py-5 text-white">
      <MetadataAttributesTable actionId={params.actionId} />
    </div>
  );
}
