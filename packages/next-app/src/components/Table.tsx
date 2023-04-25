import { createContext, useContext } from "react";

const TableContext = createContext({});

function useTableContext() {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error(
      "Child components of Table cannot be rendered outside the Table component!"
    );
  }

  return context;
}

export default function Table({ children }: React.PropsWithChildren) {
  return (
    <TableContext.Provider value={{}}>
      <table className="block min-w-full divide-y divide-gray-700 overflow-auto rounded bg-gray-800 border border-gray-700">
        {children}
      </table>
    </TableContext.Provider>
  );
}

function HeaderRow({ children }: React.PropsWithChildren) {
  useTableContext();
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
}

function HeaderCell({ children }: React.PropsWithChildren) {
  useTableContext();
  return (
    <th
      scope="col"
      className="text-gray-40 p-4 text-left text-sm font-semibold"
    >
      {children}
    </th>
  );
}

function Body({ children }: React.PropsWithChildren) {
  useTableContext();
  return <tbody className="overflow-auto">{children}</tbody>;
}

function BodyRow({ children }: React.PropsWithChildren) {
  useTableContext();
  return <tr>{children}</tr>;
}

function BodyCell({ children }: React.PropsWithChildren) {
  useTableContext();
  return <td className="w-fit p-4 text-sm text-gray-500">{children}</td>;
}

Table.HeaderRow = HeaderRow;
Table.HeaderCell = HeaderCell;
Table.Body = Body;
Table.BodyRow = BodyRow;
Table.BodyCell = BodyCell;
