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
      <div className="min-w-full  border-gray-700 rounded border">
        <table className="divide-y divide-gray-700 bg-gray-800 min-w-full rounded">
          {children}
        </table>
      </div>
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
  return <tbody>{children}</tbody>;
}

function BodyRow({ children }: React.PropsWithChildren) {
  useTableContext();
  return <tr>{children}</tr>;
}

function BodyCell({ children }: React.PropsWithChildren) {
  useTableContext();
  return (
    <td className="whitespace-nowrap p-4 text-sm  text-gray-500">{children}</td>
  );
}

Table.HeaderRow = HeaderRow;
Table.HeaderCell = HeaderCell;
Table.Body = Body;
Table.BodyRow = BodyRow;
Table.BodyCell = BodyCell;
