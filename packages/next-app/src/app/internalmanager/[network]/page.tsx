"use client";

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";
import { useAccount, useNetwork } from "#/wagmi";

import { TokenTable } from "../(components)/TokenTable";

export default function Page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  const { chain } = useNetwork();

  const network = getNetwork(chain?.name);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col mt-20 gap-y-5 w-4/6">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate12 text-3xl">My Internal Balances</h1>
          </div>
          <div className="flex gap-4">
            <Link href={`/internalmanager/${network}/deposit/`}>
              <Button className="flex items-center gap-1" title="New deposit">
                <PlusIcon />
                Deposit
              </Button>
            </Link>
            <Link href={`/internalmanager/${network}/withdraw/all`}>
              <Button
                className="flex items-center gap-1"
                shade="light"
                variant="outline"
                title="Withdraw all"
              >
                <MinusIcon />
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
        <TokenTable />
      </div>
    </div>
  );
}
