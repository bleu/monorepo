"use client";

import { SingleInternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Ethereum";
import { getInternalBalanceSchema } from "@balancer-pool-metadata/schema";
import {
  Address,
  addressRegex,
  buildBlockExplorerAddressURL,
  Network,
  NetworkChainId,
  networkFor,
} from "@balancer-pool-metadata/shared";
import { BigNumber } from "@ethersproject/bignumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useAccount, useBalance, useNetwork } from "wagmi";

import { TokenSelect } from "#/app/internalmanager/(components)/TokenSelect";
import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import { Spinner } from "#/components/Spinner";
import { Toast } from "#/components/Toast";
import {
  STAGE_CN_MAPPING,
  TransactionProgressBar,
} from "#/components/TransactionProgressBar";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { getNetwork } from "#/contexts/networks";
import {
  TransactionStatus,
  useInternalBalancesTransaction,
} from "#/hooks/useTransaction";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import {
  operationKindType,
  UserBalanceOpKind,
} from "#/lib/internal-balance-helper";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

type TokenData = Omit<
  ArrElement<GetDeepProp<SingleInternalBalanceQuery, "userInternalBalances">>,
  "__typename"
>;

export default function Page({
  params,
}: {
  params: {
    tokenAddress: Address;
    network: Network;
    operationKind: keyof typeof operationKindType;
  };
}) {
  const { chain } = useNetwork();
  const [tokenData, setTokenData] = useState<TokenData | undefined>(undefined);
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
      userAddress: addressLower as Address,
      tokenAddress: params.tokenAddress,
    });

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as Address,
  });

  const { data: walletAmount } = useBalance({
    address: addressLower as Address,
    token: params.tokenAddress,
  });

  const tokenInfo = internalBalanceTokenData?.user
    ?.userInternalBalances?.[0] || {
    balance: "0",
    tokenInfo: {
      __typename: "Token",
      address: params.tokenAddress,
      decimals: walletAmount?.decimals || 0,
      symbol: walletAmount?.symbol || "",
      name: walletAmount?.symbol || "",
    },
  };

  useEffect(() => {
    setTokenData(tokenInfo);
  }, [internalBalanceTokenData]);

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

  if (
    (operationKindType[params.operationKind] !== operationKindType.deposit &&
      (tokenData?.balance === "0" ||
        internalBalanceTokenData?.user === null)) ||
    (operationKindType[params.operationKind] === operationKindType.deposit &&
      walletAmount?.value.eq(0))
  ) {
    return (
      <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col h-full">
        <div className="text-center text-amber9 text-3xl">
          Looks like you don't have this token
        </div>
        <div className="text-white text-xl">
          Please click
          <Link href={"/internalmanager"}>
            <span className="text-gray11"> here </span>
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
          userAddress={addressLower as Address}
          tokenData={tokenData}
          chainId={chain?.id}
          walletAmount={walletAmount?.formatted}
          walletAmountBigNumber={walletAmount?.value}
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
  userAddress: Address;
  tokenData: ArrElement<
    GetDeepProp<SingleInternalBalanceQuery, "userInternalBalances">
  >;
  chainId?: NetworkChainId;
  walletAmount?: string;
  walletAmountBigNumber?: BigNumber;
}) {
  const network = networkFor(chainId);

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
    operationKind: operationKindEnum,
  });

  const explorerData = buildBlockExplorerAddressURL({
    chainId,
    address: userAddress,
  });

  const receiverAddressValue = watch("receiverAddress");

  function handleOnSubmit(data: FieldValues) {
    handleTransaction({ data, decimals: tokenData.tokenInfo.decimals });
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
          <Link href={`/internalmanager/${network}`}>
            <div className="absolute left-8 flex h-full items-center">
              <ArrowLeftIcon
                height={16}
                width={16}
                className="text-gray10 hover:text-amber10 duration-200"
              />
            </div>
          </Link>
          <div className="flex flex-col items-center py-3 min-w-[530px]">
            <div className="text-xl">{title} Internal Balance</div>
            <span className="text-gray12 text-sm">{description}</span>
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
              <span className="text-gray10">
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
                {operationKindEnum === UserBalanceOpKind.TRANSFER_INTERNAL &&
                explorerData ? (
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
