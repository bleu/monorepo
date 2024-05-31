import { capitalize } from "@bleu/utils";
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
        {capitalize(style)}: {title}
      </div>
      <div
        className={cn("px-4 py-3 max-w-prose text-base border border-border")}
      >
        {children}
      </div>
    </div>
  );
}
