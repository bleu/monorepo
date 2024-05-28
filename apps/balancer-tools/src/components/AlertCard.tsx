import { capitalize } from "@bleu/utils";
import cn from "clsx";

export function AlertCard({
  message,
  title,
  style,
}: {
  style: "error" | "warning";
  message: string;
  title: string;
}) {
  return (
    <div role="alert">
      <div
        className={cn(
          "font-bold text-slate12 rounded-t px-4 py-2 mt-1",
          style === "error" ? "bg-tomato9" : "bg-amber9"
        )}
      >
        {capitalize(style)} : {title}
      </div>
      <div
        className={cn(
          "border rounded-b px-4 py-3",
          style === "error"
            ? "bg-tomato12 border-red-400 text-tomato7"
            : "bg-amber12 border-yellow-300 text-yellow-800 "
        )}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
