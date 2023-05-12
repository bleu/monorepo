"use client";

import { Network } from "@balancer-pool-metadata/shared";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import { TokenSelect } from "#/app/internalmanager/(components)/TokenSelect";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import Spinner from "#/components/Spinner";
import {
  STAGE_CN_MAPPING,
  TransactionProgressBar,
} from "#/components/TransactionProgressBar";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { getNetwork } from "#/contexts/networks";
import { impersonateWhetherDAO } from "#/lib/gql";
import {
  operationKindType,
  UserBalanceOpKind,
} from "#/lib/internal-balance-helper";

export default function Page({
  params,
}: {
  params: {
    network: Network;
    operationKind: operationKindType;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const { clearNotification } = useInternalBalance();

  useEffect(() => {
    clearNotification();
  }, [isConnecting, addressLower]);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  const network = getNetwork(chain?.name);

  if (network !== params.network) {
    return (
      <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col h-full">
        <div className="text-center text-amber9 text-3xl">
          You are on the wrong network
        </div>
        <div className="text-white text-xl">
          Please change to {params.network}
        </div>
      </div>
    );
  }

  return (
    <>
      <TransactionCard
        operationKindParam={params.operationKind as unknown as string}
        userAddress={addressLower as `0x${string}`}
      />
    </>
  );
}

function TransactionCard({
  operationKindParam,
  userAddress,
}: {
  operationKindParam: string;
  userAddress: `0x${string}`;
}) {
  const operationKindData = {
    [UserBalanceOpKind.DEPOSIT_INTERNAL]: {
      title: "Deposit to",
      description: "Deposit from your wallet to an Internal Balance",
      operationKindEnum: UserBalanceOpKind.DEPOSIT_INTERNAL,
    },
    [UserBalanceOpKind.WITHDRAW_INTERNAL]: {
      title: "Withdraw from",
      description: "Withdraw from your Internal Balance to a wallet",
      operationKindEnum: UserBalanceOpKind.WITHDRAW_INTERNAL,
    },
    [UserBalanceOpKind.TRANSFER_INTERNAL]: {
      title: "Transfer to",
      description: "Transfer between Internal Balances",
      operationKindEnum: UserBalanceOpKind.TRANSFER_INTERNAL,
    },
  };
  const { title, description, operationKindEnum } =
    operationKindData[
      operationKindType[operationKindParam as keyof typeof operationKindType]
    ];

  const { transactionStatus } = useInternalBalance();

  const stage = STAGE_CN_MAPPING[transactionStatus];

  return (
    <div className="flex items-center justify-center h-full">
      <form className="flex flex-col text-white bg-blue3 h-fit my-4 w-fit rounded-lg divide-y divide-gray-700 border border-gray-700">
        <div className="relative w-full flex justify-center h-full">
          <Link href={"/internalmanager"}>
            <div className="absolute left-8 flex h-full items-center">
              <ArrowLeftIcon
                height={16}
                width={16}
                className="text-gray-500 hover:text-amber10 duration-200"
              />
            </div>
          </Link>
          <div className="flex flex-col items-center py-3 min-w-[530px]">
            <div className="text-xl">{title} Internal Balance</div>
            <span className="text-gray-200 text-sm">{description}</span>
          </div>
        </div>
        <div className="p-9 flex flex-col gap-y-6">
          <div>
            <div className="flex justify-between gap-7 h-fit">
              <div className="w-1/2">
                <TokenSelect operationKind={operationKindParam} />
              </div>
              <div className="flex gap-2 items-end w-1/2">
                <div className="w-full">
                  <Input type="string" label="Amount" placeholder={"0.01"} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Input
              type="string"
              label="Receiver Address"
              placeholder={userAddress}
            />
          </div>
          {operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL && (
            <TransactionProgressBar stage={stage} />
          )}
          <div className="flex justify-center">
            <Button type="submit" className="w-full" disabled={true}>
              <span>Select a Token</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
