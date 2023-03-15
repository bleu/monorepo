import { CaretDownIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { truncateAddress } from "#/utils/truncateAddress";

import { Button } from "./Button";

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
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-blue-500 text-gray-50 hover:bg-blue-400 focus-visible:outline-blue-500 disabled:bg-gray-600"
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="rounded-md bg-yellow-500 py-2 px-4 font-semibold text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 "
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex gap-4">
                  <Button
                    onClick={openAccountModal}
                    className="bg-blue-500 text-gray-50 hover:bg-blue-400 focus-visible:outline-blue-500 disabled:bg-gray-600"
                    type="button"
                  >
                    {truncateAddress(account.address)}
                  </Button>
                  <Button
                    onClick={openChainModal}
                    className="border border-white bg-gray-800 text-gray-200 hover:bg-gray-700 focus-visible:outline-gray-800 disabled:bg-gray-600"
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      {chain.hasIcon && (
                        <div className="mr-2 rounded-full">
                          {chain.iconUrl && (
                            <Image
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={12}
                              height={12}
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
