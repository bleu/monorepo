import cn from "classnames";

export function Badge({
  children,
  variant = "default",
  isSelected = false,
  isTrackingTighter = false,
}: React.PropsWithChildren<{
  isSelected?: boolean;
  variant?: string;
  isTrackingTighter?: boolean;
}>) {
  const outline = variant === "outlined";

  return (
    <span
      className={cn("rounded text-sm font-bold break-words", {
        "bg-transparent border border-slate6 text-slate12 group-hover:text-slate12 uppercase p-1 leading-4":
          outline,
        "text-slate12 px-1": !outline,
        "bg-blue4 text-slate12": !isSelected && !outline,
        "bg-blue8": isSelected && !outline,
        "tracking-tighter": isTrackingTighter,
      })}
    >
      {children}
    </span>
  );
}
