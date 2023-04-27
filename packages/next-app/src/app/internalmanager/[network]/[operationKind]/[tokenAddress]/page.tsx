"use client";

import { getInternalBalanceSchema } from "@balancer-pool-metadata/schema";
import { Network } from "@balancer-pool-metadata/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import cn from "classnames";
import { upperFirst } from "lodash";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useNetwork } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import Spinner from "#/components/Spinner";
import { Toast } from "#/components/Toast";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { useInternalBalancesTransaction } from "#/hooks/useTransaction";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";

enum operationKind {
  "deposit" = UserBalanceOpKind.DEPOSIT_INTERNAL,
  "withdraw" = UserBalanceOpKind.WITHDRAW_INTERNAL,
  "transfer" = UserBalanceOpKind.TRANSFER_INTERNAL,
}

export default function Page({
  params,
}: {
  params: {
    tokenAddress: `0x${string}`;
    network: Network;
    operationKind: string;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const [hasBalance, setHasBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const {
    token,
    setToken,
    setUserAddress,
    userAddress,
    notification,
    clearNotification,
    setIsNotifierOpen,
    isNotifierOpen,
    transactionUrl,
  } = useInternalBalance();

  useEffect(() => {
    clearNotification();
    setUserAddress(addressLower as `0x${string}`);
    if (token?.tokenInfo) {
      setIsLoading(false);
      setHasBalance(true);
    }
    if (!token?.tokenInfo) {
      internalBalances
        .gql(chain?.id.toString() || "1")
        .SingleInternalBalance({
          userAddress: addressLower as `0x${string}`,
          tokenAddress: params.tokenAddress,
        })
        .then((data) => {
          if (data.user?.userInternalBalances) {
            setToken(data.user?.userInternalBalances[0]);
            setIsLoading(false);
            setHasBalance(true);
          }
          if (data.user === null) {
            setIsLoading(false);
            setHasBalance(false);
          }
        });
    }
  }, [isConnecting]);

  const InternalBalanceSchema = getInternalBalanceSchema({
    totalBalance: token?.balance,
    userAddress: addressLower,
    operationKind: params.operationKind,
  });

  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: zodResolver(InternalBalanceSchema),
  });

  const operationKindData = {
    [UserBalanceOpKind.DEPOSIT_INTERNAL]: {
      title: "Deposit to",
      description: "Deposit from your wallet to an internal balance",
      operationKindEnum: UserBalanceOpKind.DEPOSIT_INTERNAL,
    },
    [UserBalanceOpKind.WITHDRAW_INTERNAL]: {
      title: "Withdraw from",
      description: "Withdraw from your internal balance to a wallet",
      operationKindEnum: UserBalanceOpKind.WITHDRAW_INTERNAL,
    },
    [UserBalanceOpKind.TRANSFER_INTERNAL]: {
      title: "Transfer to",
      description:
        "Transfer from your internal balance to another internal balance",
      operationKindEnum: UserBalanceOpKind.TRANSFER_INTERNAL,
    },
  };

  const { title, description, operationKindEnum } =
    operationKindData[
      operationKind[params.operationKind as keyof typeof operationKind]
    ];

  const { handleWithdraw } = useInternalBalancesTransaction({
    userAddress,
    token,
    operationKind: operationKindEnum,
  });

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting || isLoading) {
    return <Spinner />;
  }

  if (chain?.name.toLowerCase() !== params.network) {
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

  if (token?.balance === "0" || !hasBalance) {
    return (
      <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col h-full">
        <div className="text-center text-amber9 text-3xl">
          Looks like you don't have this token
        </div>
        <div className="text-white text-xl">
          Please click
          <Link href={"/internalmanager"}>
            <span className="text-gray-400"> here </span>
          </Link>
          to check which tokens you have
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-fit p-14">
      <form
        onSubmit={handleSubmit(handleWithdraw)}
        className="flex flex-col text-white gap-y-6 bg-blue3 h-full w-full rounded-lg p-14"
      >
        <div className="relative w-full flex justify-center">
          <Link href={"/internalmanager"}>
            <div className="absolute left-0 flex h-full items-center">
              <ArrowLeftIcon
                height={20}
                width={20}
                className="hover:text-amber10 duration-200"
              />
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <div className="font-bold">{title} Internal Balance</div>
            <span>{description}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between gap-7">
            <div className="w-1/2">
              <Input
                readOnly
                type="text"
                label="Token"
                placeholder={token.tokenInfo.name as string}
                value={token.tokenInfo.address}
                {...register("tokenAddress")}
                errorMessage={formState.errors?.tokenAddress?.message as string}
              />
            </div>
            <div className="flex gap-2 items-end w-1/2">
              <div className="w-full">
                <Input
                  type="string"
                  label="Amount"
                  placeholder={token.balance}
                  {...register("tokenAmount")}
                  errorMessage={
                    formState.errors?.tokenAmount?.message as string
                  }
                />
              </div>
              <button
                type="button"
                className="bg-blue4 text-blue9 w-fit px-3 h-[35px] mb-11 rounded-[4px] shadow-[0_0_0_1px] shadow-blue6 outline-none"
                onClick={() => {
                  setValue("tokenAmount", token.balance);
                }}
              >
                Max
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div
              className={cn(
                operationKindEnum !== UserBalanceOpKind.TRANSFER_INTERNAL
                  ? "w-9/12"
                  : "w-full"
              )}
            >
              <Input
                type="string"
                label="Receiver Address"
                placeholder={userAddress}
                {...register("receiverAddress")}
                errorMessage={
                  formState.errors?.receiverAddress?.message as string
                }
              />
            </div>
            {operationKindEnum !== UserBalanceOpKind.TRANSFER_INTERNAL && (
              <button
                type="button"
                className="w-3/12 inline-block bg-blue4 text-blue9 h-[35px] px-3 mb-11 rounded-[4px] shadow-[0_0_0_1px] shadow-blue6 outline-none"
                onClick={() => {
                  setValue("receiverAddress", userAddress);
                }}
              >
                Use Current Address
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-indigo-500  text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500 border border-transparent"
          >
            {upperFirst(params.operationKind)}
            <span className="sr-only"> token</span>
          </Button>
        </div>
      </form>
      {notification && (
        <Toast
          content={
            <ToastContent
              title={notification.title}
              description={notification.description}
              link={transactionUrl}
            />
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          variant={notification.variant}
        />
      )}
    </div>
  );
}
