export default function ChartSkelton() {
  return (
    <div
      role="status"
      className="w-full p-4 border border-blue6 bg-blue3 rounded animate-pulse md:p-6"
    >
      <div className="h-2.5 bg-blue6 rounded-full w-32 mb-2.5 pb-4"></div>
      <div className="flex items-baseline mt-4 space-x-6">
        <div className="w-full h-64 bg-blue6 rounded-t-lg"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-80"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-72"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-80"></div>
        <div className="w-full h-64 bg-blue6 rounded-t-lg"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-80"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-72"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-80"></div>
        <div className="w-full h-64 bg-blue6 rounded-t-lg"></div>
        <div className="w-full bg-blue6 rounded-t-lg h-80"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
