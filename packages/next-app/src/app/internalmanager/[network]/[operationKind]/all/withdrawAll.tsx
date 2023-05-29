"use client";
import { InternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Ethereum";
import { AddressSchema } from "@balancer-pool-metadata/schema";
import { Address, networkFor } from "@balancer-pool-metadata/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { tokenLogoUri } from "public/tokens/logoUri";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useAccount, useNetwork } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { useInternalBalancesTransaction } from "#/hooks/useTransaction";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export function WithdrawAll() {
  const {
    notification,
    setIsNotifierOpen,
    isNotifierOpen,
    transactionUrl,
    clearNotification,
  } = useInternalBalance();
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const network = networkFor(chain?.id);

  const { data: tokenData, mutate } = internalBalances
    .gql(chain?.id.toString() || "1")
    .useInternalBalance({
      userAddress: addressLower as Address,
    });

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as Address,
  });

  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: zodResolver(AddressSchema),
  });

  const { setSubmitData } = useInternalBalancesTransaction({
    userAddress: addressLower as Address,
    operationKind: UserBalanceOpKind.WITHDRAW_INTERNAL,
  });

  function handleOnSubmit(data: FieldValues) {
    if (!tokenData?.user?.userInternalBalances) return;
    const tokenInfo = tokenData.user.userInternalBalances.map((token) => {
      return {
        tokenAddress: token.tokenInfo.address as Address,
        tokenDecimals: token.tokenInfo.decimals,
        tokenAmount: token.balance,
        receiverAddress: data.receiverAddress,
      };
    });
    setSubmitData(tokenInfo);
  }

  useEffect(() => {
    clearNotification();
  }, [isConnecting, addressLower]);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting || !tokenData) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col text-white bg-blue3 h-fit my-4 w-fit rounded-lg divide-y divide-slate7 border border-slate7"
      >
        <div className="relative w-full flex justify-center h-full">
          <Link href={`/internalmanager/${network}`}>
            <div className="absolute left-8 flex h-full items-center">
              <ArrowLeftIcon
                height={16}
                width={16}
                className="text-slate10 hover:text-amber10 duration-200"
              />
            </div>
          </Link>
          <div className="flex flex-col items-center py-3 min-w-[530px]">
            <div className="text-xl">Batch Withdraw from Internal Balances</div>
          </div>
        </div>
        <div className="p-9 flex flex-col gap-y-6">
          <div>
            <span className="block text-sm text-slate12">Summary</span>
            <Table color="blue">
              <Table.Body>
                {tokenData?.user?.userInternalBalances?.map(
                  (
                    token: ArrElement<
                      GetDeepProp<InternalBalanceQuery, "userInternalBalances">
                    >
                  ) => (
                    <Table.BodyRow key={token.tokenInfo.address}>
                      <Table.BodyCell customWidth="w-12">
                        <Image
                          src={
                            tokenLogoUri[
                              token?.tokenInfo
                                ?.symbol as keyof typeof tokenLogoUri
                            ] || genericTokenLogo
                          }
                          className="rounded-full"
                          alt="Token Logo"
                          height={28}
                          width={28}
                          quality={100}
                        />
                      </Table.BodyCell>
                      <Table.BodyCell>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium">
                            {token.tokenInfo.name} ({token.tokenInfo.symbol})
                          </div>
                        </div>
                      </Table.BodyCell>
                      <Table.BodyCell>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium">
                            {token.balance}
                          </div>
                        </div>
                      </Table.BodyCell>
                    </Table.BodyRow>
                  )
                )}
              </Table.Body>
            </Table>
          </div>
          <div>
            <Input
              type="string"
              label="Receiver Address"
              placeholder={addressLower}
              {...register("receiverAddress")}
              errorMessage={
                formState.errors?.receiverAddress?.message as string
              }
            />
            <div className="mt-2 text-xs flex gap-x-1">
              <button
                type="button"
                className="outline-none text-blue9 hover:text-amber9"
                onClick={() => {
                  setValue("receiverAddress", addressLower);
                }}
              >
                Use Current Address
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="w-full">
              <span>Withdraw All Internal Balance</span>
            </Button>
          </div>
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
