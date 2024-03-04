import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import cn from "clsx";
import copy from "copy-to-clipboard";
import React, { useCallback, useLayoutEffect } from "react";

import { Tooltip } from "./Tooltip";

export function ClickToCopy({
  text,
  className,
  children,
}: CopyToClipboardProps) {
  const [copied, setCopied] = React.useState(false);

  useLayoutEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <Tooltip content="Click to copy">
      <div>
        <CopyToClipboard
          text={text}
          onCopy={() => setCopied(true)}
          className={cn("flex flex-row items-center", className)}
        >
          <>
            <span className="mr-1">{children}</span>
            {!copied ? (
              <ClipboardCopyIcon
                width={18}
                height={18}
                className="text-primary-foreground"
              />
            ) : (
              <CheckIcon width={18} height={18} className="text-highlight" />
            )}
          </>
        </CopyToClipboard>
      </div>
    </Tooltip>
  );
}

type CopyToClipboardProps = React.PropsWithChildren<{
  text: string;
  className?: string;
  onCopy?: () => void;
}>;

function CopyToClipboard({
  text,
  className,
  onCopy,
  children,
}: CopyToClipboardProps) {
  const [copied, setCopied] = React.useState(false);

  useLayoutEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = useCallback(() => {
    copy(text);
    onCopy?.();
  }, [text, onCopy]);

  return (
    <div className={cn("cursor-pointer", className)} onClick={handleCopy}>
      {children}
    </div>
  );
}
