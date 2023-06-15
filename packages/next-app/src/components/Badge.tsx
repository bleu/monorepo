import cn from "clsx";

export function Badge({
  children,
  isSelected = false,
  variant = "default",
}: React.PropsWithChildren<{
  isSelected?: boolean;
  variant?: string;
}>) {
  const outline = variant === "outlined";

  return (
    <span
      className={cn("rounded text-sm font-bold", {
        "bg-transparent border border-slate6 text-slate12 group-hover:text-slate12 uppercase p-1 leading-4":
          outline,
        "text-slate12 px-1": !outline,
        "bg-blue4 text-slate12": !isSelected && !outline,
        "bg-blue8": isSelected && !outline,
      })}
    >
      {children}
    </span>
  );
}
