function TableDataSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="h-2.5 w-12 rounded-full bg-blue6"></div>
      <div className="h-2.5 w-12 rounded-full bg-blue6"></div>
    </div>
  );
}
function TableRowSkeleton({ classNames }: { classNames: string }) {
  return (
    <div className={`flex items-center justify-between ${classNames}`}>
      <TableDataSkeleton />
      <TableDataSkeleton />
    </div>
  );
}

export default function TableSkeleton({
  colNumbers = 10,
}: {
  colNumbers?: number;
}) {
  return (
    <div className="w-full animate-pulse space-y-4 rounded border p-4 shadow md:p-6 border-blue6 bg-blue3">
      <TableRowSkeleton classNames="border-b border-blue6 pb-4" />
      {Array.from({ length: colNumbers }).map((_, idx) => (
        <TableRowSkeleton key={idx} classNames="pt-4" />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
