const MetadataHeader = () => {
  return (
    <div className="flex w-full justify-around">
      <div className="text-lg font-semibold text-gray-200">Name</div>
      <div className="text-lg font-semibold text-gray-200">Type</div>
      <div className="text-lg font-semibold text-gray-200">Description</div>
      <div className="text-lg font-semibold text-gray-200">Value</div>
    </div>
  );
};

export function MetadataAttribute() {
  return (
    <div className="h-full w-full">
      <div className="flex h-96 w-96 max-w-full flex-col items-start justify-start space-y-4">
        <div className="text-2xl font-medium text-gray-400">
          Metadata attributes
        </div>
        <div className="flex h-full w-96 flex-col items-stretch bg-gray-800">
          <MetadataHeader />
          <div className="h-[40px] bg-yellow-200">1</div>
          <div className="h-[40px] bg-white">2</div>
          <div className="h-[40px] bg-pink-100">3</div>
        </div>
      </div>
    </div>
  );
}
