import cn from "clsx";
import { createContext, useContext } from "react";

const TableContext = createContext({});

const predefinedClasses = {
  gray: {
    solid: {
      dark: { style: "bg-slate3", border: "border-0" },
      darkWithBorder: {
        style: "bg-slate3",
        border: "border border-slate7 rounded",
      },
    },
  },
  blue: {
    solid: {
      dark: { style: "bg-blue3", border: "border-0" },
      darkWithBorder: {
        style: "bg-blue3",
        border: "border border-blue6 rounded",
      },
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
      "Child components of Table cannot be rendered outside the Table component!",
    );
  }

  return context;
}

export default function Table({
  children,
  color = "gray",
  variant = "solid",
  shade = "dark",
  classNames,
}: React.PropsWithChildren<{
  color?: TableColor;
  variant?: TableVariant;
  shade?: TableShade;
  classNames?: string;
}>) {
  return (
    <TableContext.Provider value={{}}>
      <div
        className={cn(
          "min-w-full",
          predefinedClasses[color][variant][shade].border,
          classNames ?? classNames,
        )}
      >
        <table
          className={cn(
            "divide-y divide-slate7 min-w-full rounded",
            predefinedClasses[color][variant][shade].style,
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

function HeaderCell({
  children,
  padding = "p-4",
}: React.PropsWithChildren<{ padding?: string }>) {
  useTableContext();
  return (
    <th
      scope="col"
      className={cn("text-slate12 text-left text-sm font-semibold", padding)}
    >
      {children}
    </th>
  );
}

function Body({ children }: React.PropsWithChildren) {
  useTableContext();
  return <tbody>{children}</tbody>;
}

function BodyRow({
  children,
  classNames,
  onClick,
}: React.PropsWithChildren<{ classNames?: string; onClick?: () => void }>) {
  useTableContext();
  return (
    <>
      {onClick ? (
        <tr className={cn(classNames)} onClick={onClick}>
          {children}
        </tr>
      ) : (
        <tr className={cn(classNames)}>{children}</tr>
      )}
    </>
  );
}

function BodyCell({
  children,
  customWidth,
  padding = "p-4",
  colSpan = 1,
}: React.PropsWithChildren<{
  customWidth?: string;
  padding?: string;
  colSpan?: number;
}>) {
  useTableContext();
  return (
    <td
      className={cn(
        "whitespace-nowrap text-sm text-slate10",
        customWidth ? cn(customWidth, "pl-4") : colSpan === 1 ? padding : "p-0",
      )}
      colSpan={colSpan}
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
