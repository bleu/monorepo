export function Spinner() {
  return (
    <div className="flex w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
      <div className="border-6 mx-2 h-12 w-12 animate-spin rounded-full border-2 border-solid border-amber10 border-l-slate10"></div>
    </div>
  );
}
