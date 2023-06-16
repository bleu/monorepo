"use client";

import { Address, Network } from "@balancer-pool-metadata/shared";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import { TokenSelect } from "#/app/internalmanager/(components)/TokenSelect";
import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
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
        userAddress={addressLower as Address}
      />
    </>
  );
}

function TransactionCard({
  operationKindParam,
  userAddress,
}: {
  operationKindParam: string;
  userAddress: Address;
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
      <form className="flex flex-col text-white bg-blue3 h-fit my-4 w-fit rounded-lg divide-y divide-slate7 border border-slate7">
        <div className="relative w-full flex justify-center h-full">
          <Link href={"/internalmanager"}>
            <div className="absolute left-8 flex h-full items-center">
              <ArrowLeftIcon
                height={16}
                width={16}
                className="text-slate10 hover:text-amber10 duration-200"
              />
            </div>
          </Link>
          <div className="flex flex-col items-center py-3 min-w-[530px]">
            <div className="text-xl">{title} Internal Balance</div>
            <span className="text-slate11 text-sm">{description}</span>
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
                  <span className="mb-2 block text-sm text-slate12"></span>
                  <input
                    className="w-full selection:color-white box-border inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
                    type="string"
                    placeholder={"0.01"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="block text-sm text-slate12">Receiver Address</span>
            <input
              className="w-full selection:color-white box-border inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
              type="string"
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
