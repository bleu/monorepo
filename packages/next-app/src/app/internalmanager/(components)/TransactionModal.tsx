/* eslint-disable no-console */
import { getInternalBalanceSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import { Toast } from "#/components/Toast";
import { useInternalBalancesTransaction } from "#/hooks/useTransaction";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";

import { useInternalBalancesTransactionProps } from "../page";

interface ITransactionModal extends useInternalBalancesTransactionProps {
  operationKind: UserBalanceOpKind | undefined;
}

export function TransactionModal({
  token,
  userAddress,
  operationKind,
}: ITransactionModal) {
  if (!operationKind) return null;

  const InternalBalanceSchema = getInternalBalanceSchema(token.balance);

  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: zodResolver(InternalBalanceSchema),
  });

  const {
    transactionUrl,
    isNotifierOpen,
    setIsNotifierOpen,
    notification,
    handleWithdraw,
  } = useInternalBalancesTransaction({
    userAddress,
    token,
    operationKind,
  });

  function getModalTitle({
    operationKind,
  }: {
    operationKind: UserBalanceOpKind;
  }) {
    switch (operationKind) {
      case UserBalanceOpKind.DEPOSIT_INTERNAL:
        return "Deposit to";
      case UserBalanceOpKind.WITHDRAW_INTERNAL:
        return "Withdraw from";
      case UserBalanceOpKind.TRANSFER_INTERNAL:
        return "Transfer to";
      default:
        return "";
    }
  }

  const modalTitle = getModalTitle({ operationKind });

  return (
    <>
      <form
        onSubmit={handleSubmit(handleWithdraw)}
        className="mx-6 flex flex-col text-white gap-y-6"
      >
        <div className="self-center font-bold">
          {modalTitle} Internal Balance
        </div>
        <div className="flex justify-between">
          <Input
            readOnly
            type="text"
            label="Token"
            placeholder={token.tokenInfo.name as string}
            customWidth="w-96"
            value={token.tokenInfo.address}
            {...register("tokenAddress")}
            errorMessage={formState.errors?.tokenAddress?.message as string}
          />
          <div className="flex gap-2 items-end">
            <Input
              type="number"
              label="Amount"
              customWidth="w-80"
              placeholder={token.balance}
              {...register("amount", {
                valueAsNumber: true,
                validate: (value) => {
                  if (value > token.balance) {
                    return "Insufficient balance";
                  }
                  return false;
                },
              })}
              errorMessage={formState.errors?.amount?.message as string}
            />
            <button
              type="button"
              className="bg-blue4 text-blue9 w-14 h-[35px] mb-11 rounded-[4px] shadow-[0_0_0_1px] shadow-blue6 outline-none"
              onClick={() => {
                setValue("amount", token.balance);
              }}
            >
              Max
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-indigo-500  text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500 border border-transparent"
          >
            Withdraw<span className="sr-only"> token</span>
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
    </>
  );
}
