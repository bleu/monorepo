import request from "graphql-request";
import { useEffect } from "react";
import useSWR from "swr";

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
  const pageHref = `/${userId}/amms/${ammId}`;
  const { data, isLoading, mutate } = useSWR(ammId, (ammId: string) =>
    request(NEXT_PUBLIC_API_URL, AMM_QUERY, { ammId }),
  );

  useEffect(() => {
    const intervalId = setInterval(() => ammId && mutate(), 10_000);

    return () => clearInterval(intervalId);
  }, [ammId, isOpen]);

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
              loading={!!data?.constantProductData || isLoading}
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
