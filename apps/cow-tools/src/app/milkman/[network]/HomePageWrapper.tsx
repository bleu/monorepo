"use client";

import { Network } from "@bleu-fi/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useAccount, useNetwork } from "wagmi";

import { Button } from "#/components";
import { LinkComponent } from "#/components/Link";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";

import { OrderTable } from "../(components)/OrdersTable";

export function HomePageWrapper({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  const network = getNetwork(chain?.name);

  if (network !== params.network) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          You are on the wrong network
        </div>
        <div className="text-xl text-white">
          Please change to {params.network}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <div className="my-10 flex w-9/12 flex-col gap-y-5">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl text-slate12">Milkman transactions</h1>
            <span>
              Here is a list of your Milkman transaction with its status.
            </span>
          </div>
          <div className="flex gap-4">
            <LinkComponent
              loaderColor="amber"
              href={`/milkman/${network}/order/new`}
              content={
                <Button
                  className="flex items-center gap-1 py-3 px-6"
                  title="New order"
                >
                  <PlusIcon />
                  New order
                </Button>
              }
            />
          </div>
        </div>
        <OrderTable />
      </div>
    </div>
  );
}
