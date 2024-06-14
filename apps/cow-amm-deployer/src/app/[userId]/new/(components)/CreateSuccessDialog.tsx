import request from "graphql-request";
import { useEffect, useState } from "react";

import { Button } from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { LinkComponent } from "#/components/Link";
import { AMM_QUERY } from "#/lib/fetchAmmData";
import { NEXT_PUBLIC_API_URL } from "#/lib/ponderApi";

export function CreateSuccessDialog({
  ammId,
  userId,
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  userId: string;
  ammId?: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [ammPageReady, setAmmPageReady] = useState<boolean>(true);
  const pageHref = `/${userId}/amms/${ammId}`;

  const updateAmmPageStatus = async () => {
    if (!pageHref || !isOpen || !ammId) return;
    try {
      const response = await request(NEXT_PUBLIC_API_URL, AMM_QUERY, { ammId });
      setAmmPageReady(!!response.constantProductData);
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
              loading={!ammPageReady}
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
