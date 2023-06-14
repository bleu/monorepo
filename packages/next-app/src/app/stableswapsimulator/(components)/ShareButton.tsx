import { Share1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

import Button from "#/components/Button";
import { Toast, ToastProvider } from "#/components/Toast";
import { Tooltip } from "#/components/Tooltip";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function ShareButton() {
  const { initialData, customData } = useStableSwap();

  const onInitialPage = window?.location.pathname === "/stableswapsimulator";
  const [isNotifierOpen, setIsNotifierOpen] = useState<boolean>(false);
  const state = {
    initialData,
    customData,
  };
  function generateLink() {
    const jsonState = JSON.stringify(state);
    const encodedState = encodeURIComponent(jsonState);
    return `${window.location.origin}${window.location.pathname}#${encodedState}`;
  }

  return (
    <ToastProvider>
      <>
        <Tooltip
          content={
            onInitialPage
              ? "You can only share the analysis page"
              : "Copy a link with the current simulation parameters"
          }
        >
          <Button shade="dark" disabled={onInitialPage}>
            <div
              onClick={() => {
                if (onInitialPage) return;
                navigator.clipboard.writeText(generateLink());
                setIsNotifierOpen(true);
              }}
              className="flex flex-row gap-4"
            >
              Share simulation
              <Share1Icon
                color="white"
                className="ml-1 font-semibold"
                height={20}
                width={20}
              />
            </div>
          </Button>
        </Tooltip>
        <Toast
          content={
            <div className="flex h-14 flex-row items-center justify-between px-4 py-8">
              <div className="flex flex-col justify-between space-y-1">
                <h1 className="text-xl font-medium text-slate12">
                  Link copied
                </h1>
                <h3 className="mb-2 text-sm leading-3 text-slate11">
                  Use it to access the dashboard state.
                </h3>
              </div>
            </div>
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          duration={5000}
        />
      </>
    </ToastProvider>
  );
}
