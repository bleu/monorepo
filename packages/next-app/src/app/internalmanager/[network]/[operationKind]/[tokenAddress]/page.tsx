"use client";

import { SingleInternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import { getInternalBalanceSchema } from "@balancer-pool-metadata/schema";
import {
  buildExplorerAddressURL,
  Network,
  NetworkChainId,
  operationKindType,
} from "@balancer-pool-metadata/shared";
import { BigNumber } from "@ethersproject/bignumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useAccount, useBalance, useNetwork } from "wagmi";

import { TokenSelect } from "#/app/internalmanager/(components)/TokenSelect";
import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import Spinner from "#/components/Spinner";
import { Toast } from "#/components/Toast";
import {
  STAGE_CN_MAPPING,
  TransactionProgressBar,
} from "#/components/TransactionProgressBar";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import {
  TransactionStatus,
  useInternalBalancesTransaction,
} from "#/hooks/useTransaction";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export default function Page({
  params,
}: {
  params: {
    tokenAddress: `0x${string}`;
    network: Network;
    operationKind: operationKindType;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const {
    notification,
    clearNotification,
    setIsNotifierOpen,
    isNotifierOpen,
    transactionUrl,
  } = useInternalBalance();

  const { data: internalBalanceTokenData, mutate } = internalBalances
    .gql(chain?.id.toString() || "1")
    .useSingleInternalBalance({
      userAddress: addressLower as `0x${string}`,
      tokenAddress: params.tokenAddress,
    });

  const tokenData = internalBalanceTokenData?.user?.userInternalBalances
    ? internalBalanceTokenData?.user?.userInternalBalances[0]
    : undefined;

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as `0x${string}`,
  });

  const { data: walletAmount } = useBalance({
    address: addressLower as `0x${string}`,
    token: params.tokenAddress,
  });

  useEffect(() => {
    clearNotification();
  }, [isConnecting, addressLower]);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting) {
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

  if (tokenData?.balance === "0" || internalBalanceTokenData?.user === null) {
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
    <>
      {tokenData && (
        <TransactionCard
          operationKindParam={params.operationKind as unknown as string}
          userAddress={addressLower as `0x${string}`}
          tokenData={tokenData}
          chainId={chain!.id}
          walletAmount={walletAmount!.formatted}
          walletAmountBigNumber={walletAmount!.value}
        />
      )}
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
    </>
  );
}

function TransactionCard({
  operationKindParam,
  userAddress,
  tokenData,
  chainId,
  walletAmount,
  walletAmountBigNumber,
}: {
  operationKindParam: string;
  userAddress: `0x${string}`;
  tokenData: ArrElement<
    GetDeepProp<SingleInternalBalanceQuery, "userInternalBalances">
  >;
  chainId: NetworkChainId;
  walletAmount: string;
  walletAmountBigNumber: BigNumber;
}) {
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
  const { title, operationKindEnum } =
    operationKindData[
      operationKindType[operationKindParam as keyof typeof operationKindType]
    ];

  const InternalBalanceSchema = getInternalBalanceSchema({
    totalBalance:
      operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL
        ? walletAmountBigNumber
        : tokenData.balance,
    userAddress: userAddress,
    operationKind: operationKindParam,
    decimals: tokenData.tokenInfo.decimals,
  });

  const { register, handleSubmit, setValue, formState, watch } = useForm({
    resolver: zodResolver(InternalBalanceSchema),
  });

  useEffect(() => {
    register("receiverAddress");
    setValue("tokenAddress", tokenData.tokenInfo.address);
  }, []);

  const { handleTransaction } = useInternalBalancesTransaction({
    userAddress: userAddress,
    tokenDecimals: tokenData.tokenInfo.decimals,
    operationKind: operationKindEnum,
  });

  const explorerData = buildExplorerAddressURL({
    chainId,
    address: userAddress,
  });

  const receiverAddressValue = watch("receiverAddress");

  const addressRegex = /0x[a-fA-F0-9]{40}/;

  function handleOnSubmit(data: FieldValues) {
    handleTransaction(data);
  }

  const { transactionStatus } = useInternalBalance();

  const stage = STAGE_CN_MAPPING[transactionStatus];

  return (
    <div className="flex items-center justify-center h-full">
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col text-white bg-blue3 h-fit my-4 w-fit rounded-lg divide-y divide-gray-700 border border-gray-700"
      >
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
            <span className="text-gray-200 text-sm">
              Lorem ipsum dolor sit amet
            </span>
          </div>
        </div>
        <div className="p-9 flex flex-col gap-y-6">
          <div>
            <div className="flex justify-between gap-7 h-fit">
              <div className="w-1/2">
                <TokenSelect
                  token={tokenData}
                  operationKind={operationKindParam}
                />
              </div>
              <div className="flex gap-2 items-end w-1/2">
                <div className="w-full">
                  <Input
                    type="string"
                    label="Amount"
                    placeholder={
                      operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL
                        ? walletAmount
                        : tokenData.balance
                    }
                    {...register("tokenAmount")}
                    errorMessage={
                      formState.errors?.tokenAmount?.message as string
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs flex gap-x-1">
              <span className="text-gray-400">
                {operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL ? (
                  <span>Wallet Balance: {walletAmount}</span>
                ) : (
                  <span>Internal Balance: {tokenData.balance}</span>
                )}
              </span>
              <button
                type="button"
                className="outline-none text-blue9 hover:text-amber9"
                onClick={() => {
                  operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL
                    ? setValue("tokenAmount", walletAmount)
                    : setValue("tokenAmount", tokenData.balance);
                }}
              >
                Max
              </button>
            </div>
          </div>
          <div>
            <div>
              <Input
                type="string"
                label="Receiver Address"
                placeholder={userAddress}
                {...register("receiverAddress")}
                errorMessage={
                  formState.errors?.receiverAddress?.message as string
                }
              />
              <div className="mt-2 text-xs flex gap-x-1">
                {operationKindEnum === UserBalanceOpKind.TRANSFER_INTERNAL ? (
                  !addressRegex.test(receiverAddressValue) ? (
                    <span className="outline-none text-blue8 hover:cursor-not-allowed">
                      View on {explorerData.name}
                    </span>
                  ) : (
                    <a
                      href={explorerData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="outline-none text-blue9 hover:text-amber9"
                    >
                      View on {explorerData.name}
                    </a>
                  )
                ) : (
                  <button
                    type="button"
                    className="outline-none text-blue9 hover:text-amber9"
                    onClick={() => {
                      setValue("receiverAddress", userAddress);
                    }}
                  >
                    Use Current Address
                  </button>
                )}
              </div>
            </div>
          </div>
          {operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL && (
            <TransactionProgressBar stage={stage} />
          )}
          <div className="flex justify-center">
            <OperationButton
              operationKindEnum={operationKindEnum}
              tokenSymbol={tokenData.tokenInfo.symbol as string}
              title={title}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

function OperationButton({
  operationKindEnum,
  tokenSymbol,
  title,
}: {
  operationKindEnum: UserBalanceOpKind;
  tokenSymbol: string;
  title: string;
}) {
  const { transactionStatus } = useInternalBalance();

  if (
    operationKindEnum === UserBalanceOpKind.DEPOSIT_INTERNAL &&
    transactionStatus === TransactionStatus.AUTHORIZING
  ) {
    return (
      <Button type="submit" className="w-full">
        <span>Approve use of {tokenSymbol}</span>
      </Button>
    );
  }
  return (
    <Button type="submit" className="w-full">
      <span>{title} Internal Balance</span>
    </Button>
  );
}
