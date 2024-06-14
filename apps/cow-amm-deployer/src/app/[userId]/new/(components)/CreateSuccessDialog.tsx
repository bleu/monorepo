import { useEffect, useState } from "react";

import { Button } from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { LinkComponent } from "#/components/Link";

export function CreateSuccessDialog({
  isOpen,
  pageHref = "/",
  setIsOpen,
}: {
  isOpen: boolean;
  pageHref?: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [ammPageReady, setAmmPageReady] = useState<boolean>(true);

  const updateAmmPageStatus = async () => {
    if (!pageHref || !isOpen) return;
    try {
      const response = await fetch(pageHref);
      setAmmPageReady(response.status === 200);
    } catch (error) {
      setAmmPageReady(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateAmmPageStatus, 1000);

    return () => clearInterval(intervalId);
  }, [pageHref, isOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="CoW AMM Created"
      content={
        <div className="flex flex-col gap-2 bg-foreground text-base items-center">
          <span>
            Your CoW AMM has been successfully created, ensuring your funds are
            protected from <i className="text-destructive">MEV losses</i>. Click
            the button below to view your AMM.
          </span>
          <LinkComponent className="w-full" href={pageHref}>
            <Button
              type="button"
              loading={ammPageReady}
              loadingText="Building AMM page..."
              className="w-full"
            >
              View CoW AMM
            </Button>
          </LinkComponent>
        </div>
      }
    ></Dialog>
  );
}
