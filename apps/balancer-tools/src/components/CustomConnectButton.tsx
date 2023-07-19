import { CaretDownIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { truncateAddress } from "#/utils/truncate";

import Button from "./Button";

export function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              className: "opacity-0 pointer-events-none select-none",
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <>
                    <Button onClick={openConnectModal} shade="dark">
                      Connect Wallet
                    </Button>
                  </>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="rounded-md bg-amber5 px-4 py-2 font-semibold text-white hover:bg-amber6 focus:outline-none focus:ring-2 focus:ring-amber6 "
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex gap-4">
                  <Button onClick={openAccountModal} shade="dark">
                    {truncateAddress(account.address)}
                  </Button>
                  <Button onClick={openChainModal} shade="dark">
                    <div className="flex items-center justify-between">
                      {chain.hasIcon && (
                        <div className="mr-2 rounded-full">
                          {chain.iconUrl && (
                            <Image
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={20}
                              height={20}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                      <CaretDownIcon
                        color="white"
                        className="ml-1 font-semibold"
                        height={20}
                        width={20}
                      />
                    </div>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
