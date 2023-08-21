import { capitalize } from "@bleu-balancer-tools/utils";
import cn from "clsx";

export function AlertCard({
  message,
  title,
  alertType,
}: {
  alertType: "error" | "warning";
  message: string;
  title: string;
}) {
  let titleBgColor, messageBgColor, messageBorderColor, messageTextColor;

  // Define styles based on the message alertType
  switch (alertType) {
    case "error":
    default:
      titleBgColor = "bg-tomato9";
      messageBgColor = "bg-tomato12";
      messageBorderColor = "border-red-400";
      messageTextColor = "text-tomato7";
      break;
    case "warning":
      titleBgColor = "bg-amber9";
      messageBgColor = "bg-amber12";
      messageBorderColor = "border-yellow-300";
      messageTextColor = "text-yellow-800";
      break;
  }

  return (
    <div role="alert">
      <div
        className={cn(
          "font-bold text-slate12 rounded-t px-4 py-2 mt-1",
          titleBgColor,
        )}
      >
        {capitalize(alertType)} : {title}
      </div>
      <div
        className={cn(
          "border rounded-b px-4 py-3",
          messageBgColor,
          messageBorderColor,
          messageTextColor,
        )}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
