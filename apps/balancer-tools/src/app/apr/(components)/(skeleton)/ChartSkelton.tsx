const Bar = ({ height }: { height: `h-${string}` }) => (
  <div className={`w-full bg-blue6 rounded-t-lg ${height}`}></div>
);

function BarSet() {
  return (
    <>
      <Bar height={"h-64"} />
      <Bar height={"h-80"} />
      <Bar height={"h-72"} />
      <Bar height={"h-80"} />
    </>
  );
}

export default function ChartSkelton() {
  return (
    <div className="w-full p-4 border border-blue6 bg-blue3 rounded animate-pulse md:p-6">
      <div className="h-2.5 bg-blue6 rounded-full w-32 mb-2.5 pb-4"></div>
      <div className="flex items-baseline mt-4 space-x-6">
        <BarSet />
        <BarSet />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
