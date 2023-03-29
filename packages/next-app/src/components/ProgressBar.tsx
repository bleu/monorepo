import * as Progress from "@radix-ui/react-progress";
import cn from "classnames";
import { useEffect, useState } from "react";

interface IProgressBar {
  variant?: "notification" | "pending" | "alert" | "success";
}

export function ProgressBar({ variant = "notification" }: IProgressBar) {
  const [progress, setProgress] = useState(0);

  let bgColor;
  switch (variant) {
    case "notification":
      bgColor = "bg-blue-600";
      break;
    case "pending":
      bgColor = "bg-yellow-600";
      break;
    case "alert":
      bgColor = "bg-red-600";
      break;
    case "success":
      bgColor = "bg-green-600";
      break;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress <= 100) {
        setProgress((prevProgress) => prevProgress + 1);
      }
    }, 25);
    return () => {
      clearInterval(interval);
    };
  }, [progress]);

  useEffect(() => {
    setProgress(0);
  }, [variant]);

  return (
    <Progress.Root
      className="relative inset-0 h-[4px] w-full overflow-hidden bg-white"
      style={{
        transform: "translateZ(0)",
      }}
      value={progress}
    >
      <Progress.Indicator
        className={cn(
          "h-full w-full transition-transform duration-[60ms]",
          bgColor
        )}
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
}
