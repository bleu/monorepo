import cn from "clsx";

const predefinedClasses = {
  gray: {
    solid: {
      dark: { style: "bg-slate3", border: "border border-slate7 rounded" },
    },
  },
  blue: {
    solid: {
      dark: { style: "bg-blue3", border: "border-0" },
    },
  },
} as const;

type TableColor = keyof typeof predefinedClasses;
type TableVariant = keyof typeof predefinedClasses.blue;
type TableShade = keyof typeof predefinedClasses.blue.solid;

export default function TableServerSide({
  children,
  color = "gray",
  variant = "solid",
  shade = "dark",
  wrapperClassNames,
  tableClassNames,
  defaultStyles = true,
}: React.PropsWithChildren<{
  color?: TableColor;
  variant?: TableVariant;
  shade?: TableShade;
  wrapperClassNames?: string;
  tableClassNames?: string;
  defaultStyles?: boolean;
}>) {
  return (
    <div
      className={cn(
        "min-w-full",
        wrapperClassNames ?? wrapperClassNames,
        defaultStyles ?? predefinedClasses[color][variant][shade].border,
      )}
    >
      <table
        className={cn(
          "divide-y divide-slate7 min-w-full rounded",
          tableClassNames ?? tableClassNames,
          predefinedClasses[color][variant][shade].style,
        )}
      >
        {children}
      </table>
    </div>
  );
}

function HeaderRow({
  children,
  classNames,
}: React.PropsWithChildren<{ classNames?: string }>) {
  return (
    <thead>
      <tr className={classNames ?? classNames}>{children}</tr>
    </thead>
  );
}

function HeaderCell({
  children,
  padding = "p-4",
}: React.PropsWithChildren<{ padding?: string }>) {
  return (
    <th
      scope="col"
      className={cn("text-slate12 text-left text-sm font-semibold", padding)}
    >
      {children}
    </th>
  );
}

function Body({
  children,
  classNames,
}: React.PropsWithChildren<{ classNames?: string }>) {
  return <tbody className={classNames}>{children}</tbody>;
}

function BodyRow({
  children,
  classNames,
}: React.PropsWithChildren<{ classNames?: string }>) {
  return <tr className={cn(classNames)}>{children}</tr>;
}

function BodyCell({
  children,
  customWidth,
  padding = "p-4",
  colspan = 1,
}: React.PropsWithChildren<{
  customWidth?: string;
  padding?: string;
  colspan?: number;
}>) {
  return (
    <td
      className={cn(
        "whitespace-nowrap text-sm text-slate10",
        customWidth ? cn(customWidth, "pl-4") : padding,
      )}
      colSpan={colspan}
    >
      {children}
    </td>
  );
}

TableServerSide.HeaderRow = HeaderRow;
TableServerSide.HeaderCell = HeaderCell;
TableServerSide.Body = Body;
TableServerSide.BodyRow = BodyRow;
TableServerSide.BodyCell = BodyCell;
