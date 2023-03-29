import { PropsWithChildren, useState } from "react";

import { Button } from "./Button";

type ButtonWithToolTipProps = {
  enabled: boolean;
  message: string;
  label: string;
  className?: string;
};

export function ButtonWithToolTip({
  children,
  enabled,
  message,
  label,
  className,
}: PropsWithChildren<ButtonWithToolTipProps>) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {enabled ? (
        children
      ) : (
        <div className="relative">
          <Button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={className}
          >
            {label}
          </Button>
          {showTooltip && (
            <div className="absolute top-full left-1/2 w-[110%] -translate-x-1/2 rounded-md bg-gray-700 p-2 text-sm text-white transition-opacity duration-1000">
              {message}
            </div>
          )}
        </div>
      )}
    </>
  );
}
