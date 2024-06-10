import cn from "clsx";

export function AlertCard({
  title,
  style,
  children,
}: {
  style: "error" | "warning";
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full justify-center" role="alert">
      <div
        className={cn(
          "font-bold text-sand12 px-4 py-2 border-t border-x border-border",
          style === "error" ? "bg-destructive" : "bg-accent"
        )}
      >
        {title}
      </div>
      <div className={cn("px-4 py-3 text-base w-full border border-border")}>
        {children}
      </div>
    </div>
  );
}
