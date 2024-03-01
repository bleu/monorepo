import { capitalize } from "@bleu-fi/utils";
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
          "font-bold text-amm-brown rounded-t px-4 py-2 mt-1",
          style === "error" ? "bg-tomato9" : "bg-amm-yellow/100",
        )}
      >
        {capitalize(style)} : {title}
      </div>
      <div
        className={cn(
          "border rounded-b px-4 py-3 max-w-prose text-base",
          style === "error"
            ? "bg-tomato12 border-red-400 text-tomato7"
            : "bg-amm-yellow/50 border-amber-300 text-amm-brown",
        )}
      >
        {children}
      </div>
    </div>
  );
}
