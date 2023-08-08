export function ErrorMessage({
  errorMessage,
  errorTitle,
}: {
  errorMessage: string;
  errorTitle: string;
}) {
  return (
    <div role="alert">
      <div className="bg-tomato9 text-slate12 font-bold rounded-t px-4 py-2 mt-1">
        Error: {errorTitle}
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-tomato12 px-4 py-3 text-tomato7">
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}
