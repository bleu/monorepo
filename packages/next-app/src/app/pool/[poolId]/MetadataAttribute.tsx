import cn from "classnames";
import { TableHTMLAttributes } from "react";

type CellProps = TableHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className, children }: CellProps) => (
  <th
    scope="col"
    className={cn(
      "py-3.5 px-3 text-left text-sm font-semibold text-white",
      className
    )}
  >
    {children}
  </th>
);

const Header = () => {
  const cols = [
    { node: "Name" },
    { node: "Type" },
    { node: "Description" },
    { node: "Value" },
    {
      node: <span className="sr-only">Edit</span>,
      className: "relative py-3.5 pl-3 pr-4 sm:pr-0",
    },
  ];

  return (
    <thead>
      <tr>
        {cols.map(({ node, className }) => (
          <Th className={className}>{node}</Th>
        ))}
      </tr>
    </thead>
  );
};

const Td = ({ className, children }: CellProps) => (
  <td
    className={cn(
      "whitespace-nowrap py-4 px-3 text-sm text-gray-300",
      className
    )}
  >
    {children}
  </td>
);

const rowData: { node: React.ReactNode; className?: string }[][] = [
  [
    { node: "Title" },
    { node: "text" },
    { node: "An image URL of the pool" },
    { node: "This pool contains many tokens..." },
  ],
];

function Row({ data }: { data: typeof rowData }) {
  const defaultActions = [
    {
      className:
        "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0",
      node: (
        <a href="#" className="text-indigo-400 hover:text-indigo-300">
          Edit
        </a>
      ),
    },
  ];

  const rows = data.map((row) => [...row, ...defaultActions]);

  return (
    <tr>
      {rows.map((row) =>
        row.map(({ className, node }) => <Td className={className}>{node}</Td>)
      )}
    </tr>
  );
}

export function MetadataAttribute({ poolId }: { poolId: string }) {
  return (
    <div className="bg-gray-900 py-10">
      <div className="pr-4 sm:pr-6 lg:pr-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">
              Metadata - Pool#{poolId}
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              A list of all the metadata registered to this pool
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-500 py-2 px-3 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Add metadata
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <table className="min-w-full divide-y divide-gray-700">
            <Header />

            <tbody className="divide-y divide-gray-800">
              <Row data={rowData} />
              <Row data={rowData} />
              <Row data={rowData} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
