"use client";

import { PlusIcon } from "@radix-ui/react-icons";

import { Button } from "#/components";
import { LinkComponent } from "#/components/Link";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";
import { useAccount, useNetwork } from "#/wagmi";

import { GaugesTable } from "../(components)/GaugesTable";

export default function page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  const { chain } = useNetwork();

  const network = getNetwork(chain?.name);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="mt-20 flex w-4/6 flex-col gap-y-5">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col text-slate12">
            <h1 className="text-3xl">Active L2 Gauges</h1>
            <span>
              Here is a list of all active gauges on second layers and how much
              each of them can be mint.
            </span>
          </div>
          <div className="flex gap-4">
            <LinkComponent
              loaderColor="amber"
              href={`/gaugescheckpointer/${network}`}
              content={
                <Button
                  className="flex items-center gap-1 p-2"
                  title="Checkpoint gauges"
                >
                  <PlusIcon />
                  Checkpoint
                </Button>
              }
            />
          </div>
        </div>
        <GaugesTable />
      </div>
    </div>
  );
}
