import { Share1Icon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Button from "#/components/Button";
import { Toast } from "#/components/Toast";
import { Tooltip } from "#/components/Tooltip";
import { useStableSwap } from "#/contexts/StableSwapContext";

export function ShareButton() {
  const { generateURL } = useStableSwap();

  const onInitialPage = usePathname() === "/stableswapsimulator";
  const [isNotifierOpen, setIsNotifierOpen] = useState<boolean>(false);

  return (
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
              navigator.clipboard.writeText(generateURL());
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
              <h1 className="text-xl font-medium text-slate12">Link copied</h1>
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
  );
}
