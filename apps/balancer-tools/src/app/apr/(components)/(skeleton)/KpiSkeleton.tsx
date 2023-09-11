export default function KpiSkeleton() {
  return (
    <div className="animate-pulse border-blue6 bg-blue3 grid w-full auto-rows-fr gap-6 rounded border p-4 sm:auto-cols-fr sm:grid-flow-col">
      <div className="bg-blue6 flex grow flex-col items-center justify-evenly rounded px-4 py-3 text-center 2xl:px-8 2xl:py-6">
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-blue8"></div>
        <div className="h-2 w-32 rounded-full bg-blue8"></div>
      </div>
      <div className="bg-blue6 flex grow flex-col items-center justify-evenly rounded px-4 py-3 text-center 2xl:px-8 2xl:py-6">
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-blue8"></div>
        <div className="h-2 w-32 rounded-full bg-blue8"></div>
      </div>
      <div className="bg-blue6 flex grow flex-col items-center justify-evenly rounded px-4 py-3 text-center 2xl:px-8 2xl:py-6">
        <div className="mb-2.5 h-2.5 w-24 rounded-full bg-blue8"></div>
        <div className="h-2 w-32 rounded-full bg-blue8"></div>
      </div>
    </div>
  );
}
