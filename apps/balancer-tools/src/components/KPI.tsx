export function KPI({ title, content }: { title: string; content: string }) {
  return (
    <div className="flex grow flex-col bg-blue6 rounded py-3 px-4 2xl:py-6 2xl:px-8 items-center">
      <div className="font-semibold">{title}</div>
      <div className="pt-2">{content}</div>
    </div>
  );
}
