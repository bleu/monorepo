"use client";

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

import { Button } from "#/components";
import Spinner from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAccount } from "#/wagmi";

import { TokenTable } from "./(components)/TokenTable";

export default function Page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col mt-20 gap-y-5 w-4/6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-400 text-3xl">My Internal Balances</h1>
            <span className="text-gray-200">
              Lorem ipsum dolor sit amet, consectetur dolor amet
            </span>
          </div>
          <div className="flex gap-4">
            <Button className="flex items-center gap-1" disabled={true}>
              <PlusIcon />
              Deposit
            </Button>
            <Button
              className="flex items-center gap-1"
              shade="light"
              variant="outline"
              disabled={true}
            >
              <MinusIcon />
              Withdraw
            </Button>
          </div>
        </div>
        <TokenTable />
      </div>
    </div>
  );
}
