import cn from "classnames";
import { createContext, useContext } from "react";

const TableContext = createContext({});

const predefinedClasses = {
  gray: {
    solid: {
      dark: "bg-gray-800 border border-gray-700",
    },
  },
  blue: {
    solid: {
      dark: "bg-blue3",
    },
  },
} as const;

type TableColor = keyof typeof predefinedClasses;
type TableVariant = keyof typeof predefinedClasses.blue;
type TableShade = keyof typeof predefinedClasses.blue.solid;

function useTableContext() {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error(
      "Child components of Table cannot be rendered outside the Table component!"
    );
  }

  return context;
}

export default function Table({
  children,
  color = "gray",
  variant = "solid",
  shade = "dark",
}: React.PropsWithChildren<{
  color?: TableColor;
  variant?: TableVariant;
  shade?: TableShade;
}>) {
  return (
    <TableContext.Provider value={{}}>
      <div className="min-w-full rounded">
        <table
          className={cn(
            "divide-y divide-gray-700 min-w-full rounded",
            predefinedClasses[color][variant][shade]
          )}
        >
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

function BodyCell({
  children,
  customWidth,
}: React.PropsWithChildren<{ customWidth?: string }>) {
  useTableContext();
  return (
    <td
      className={cn(
        "whitespace-nowrap text-sm text-gray-500",
        customWidth ? cn(customWidth, "pl-4") : "p-4"
      )}
    >
      {children}
    </td>
  );
}

Table.HeaderRow = HeaderRow;
Table.HeaderCell = HeaderCell;
Table.Body = Body;
Table.BodyRow = BodyRow;
Table.BodyCell = BodyCell;
