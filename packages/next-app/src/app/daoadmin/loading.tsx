export default function Loading() {
  return (
    <div className="h-full flex-1 p-5 text-white">
      <div className="w-full bg-gray-900">
        <div className="pr-4 sm:pr-6 lg:pr-12">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="mx-1 text-2xl font-medium text-gray-400">
                <div className="h-10 w-64 animate-pulse rounded bg-gray-700"></div>
              </h1>
            </div>
          </div>

          <div className="mt-4 flow-root rounded-md border border-gray-700 bg-gray-800">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="bg-gray-700 px-6 py-3"></th>
                  <th className="bg-gray-700 px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="px-6 py-3">
                    <div className="h-4 w-56 animate-pulse rounded bg-gray-700"></div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-96 animate-pulse rounded bg-gray-700"></div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3">
                    <div className="h-4 w-56 animate-pulse rounded bg-gray-700"></div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-96 animate-pulse rounded bg-gray-700"></div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3">
                    <div className="h-4 w-56 animate-pulse rounded bg-gray-700"></div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-96 animate-pulse rounded bg-gray-700"></div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex h-10 w-full items-center justify-center border-y border-gray-700">
              <button className="text-gray-700">
                <div className="flex items-center">
                  <span className="mx-2 animate-pulse">Loading...</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-5 w-full justify-between sm:flex sm:items-center">
            <div className="flex gap-4">
              <div className="h-10 w-40 animate-pulse rounded bg-gray-700"></div>
              <div className="h-10 w-40 animate-pulse rounded bg-gray-700"></div>
            </div>
            <div className="h-10 w-48 animate-pulse rounded bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
