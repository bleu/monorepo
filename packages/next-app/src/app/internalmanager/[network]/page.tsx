"use client";

import { Address } from "@bleu-balancer-tools/shared";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";
import { internalBalances } from "#/lib/gql";
import { refetchRequest } from "#/utils/fetcher";
import { useAccount, useNetwork } from "#/wagmi";

import { TokenTable } from "../(components)/TokenTable";

export default function Page() {
  const { address, isConnected, isReconnecting, isConnecting } = useAccount();

  const addressLower = address ? address?.toLowerCase() : "";

  const { chain } = useNetwork();

  const network = getNetwork(chain?.name);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  const {
    data: internalBalanceData,
    mutate,
    isLoading,
  } = internalBalances.gql(chain?.id.toString() || "1").useInternalBalance({
    userAddress: addressLower as Address,
  });

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as Address,
  });

  const hasTokenWithBalance =
    !!internalBalanceData?.user?.userInternalBalances?.length &&
    internalBalanceData?.user?.userInternalBalances?.length > 0;

  return (
    <div className="flex w-full justify-center">
      <div className="mt-20 flex w-4/6 flex-col gap-y-5">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl text-slate12">My Internal Balances</h1>
          </div>
          <div className="flex gap-4">
            <Link href={`/internalmanager/${network}/deposit/`}>
              <Button className="flex items-center gap-1" title="New deposit">
                <PlusIcon />
                Deposit Token
              </Button>
            </Link>
            {isLoading ? (
              <WithdrawBatchButton disabled={true} network={"1"} />
            ) : (
              <WithdrawBatchButton
                disabled={!hasTokenWithBalance}
                network={network}
              />
            )}
          </div>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <TokenTable internalBalanceData={internalBalanceData} />
        )}
      </div>
    </div>
  );
}

function WithdrawBatchButton({
  disabled,
  network,
}: {
  disabled: boolean;
  network: string;
}) {
  return (
    <Link href={`/internalmanager/${network}/withdraw/all`}>
      <Button
        className="flex items-center gap-1"
        shade="light"
        variant="outline"
        title="Withdraw all"
        disabled={disabled}
      >
        <MinusIcon />
        Batch Withdraw
      </Button>
    </Link>
  );
}
