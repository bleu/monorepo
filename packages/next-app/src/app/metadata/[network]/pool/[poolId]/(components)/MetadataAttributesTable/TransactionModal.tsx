"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import cn from "classnames";
import { PropsWithChildren, useState } from "react";

import { Button } from "#/components";
import { Toast } from "#/components/Toast";
import { usePoolMetadata } from "#/contexts/PoolMetadataContext";
import { TransactionStatus, useTransaction } from "#/hooks/useTransaction";

type Stage = {
  pinningStep: string;
  transitionLine: string;
  writingOnChainStep: string;
};

const STAGE_CN_MAPPING: Record<TransactionStatus, Stage> = {
  [TransactionStatus.PINNING]: {
    pinningStep: "border-amber6 text-amber10",
    transitionLine: "bg-blue4",
    writingOnChainStep: "border-slate6 text-slate12",
  },
  [TransactionStatus.CONFIRMING]: {
    pinningStep: "border-green6 text-green4",
    transitionLine: "bg-green4",
    writingOnChainStep: "border-amber6 text-amber10",
  },
  [TransactionStatus.SUBMITTING]: {
    pinningStep: "border-green6 text-green4",
    transitionLine: "bg-green4",
    writingOnChainStep: "border-amber6 text-amber10",
  },
  [TransactionStatus.CONFIRMED]: {
    pinningStep: "border-green6 text-green4",
    transitionLine: "bg-green4",
    writingOnChainStep: "border-green6 text-green4",
  },
  [TransactionStatus.PINNING_ERROR]: {
    pinningStep: "border-tomato6 text-tomato10",
    transitionLine: "bg-blue4",
    writingOnChainStep: "border-slate6 text-slate12",
  },
  [TransactionStatus.WRITE_ERROR]: {
    pinningStep: "border-green6 text-green4",
    transitionLine: "bg-green4",
    writingOnChainStep: "border-tomato6 text-tomato10",
  },
  [TransactionStatus.AUTHORIZING]: {
    pinningStep: "border-amber6 text-amber10",
    transitionLine: "bg-blue4",
    writingOnChainStep: "border-slate6 text-slate12",
  },
  [TransactionStatus.WAITING_APPROVAL]: {
    pinningStep: "border-green6 text-green4",
    transitionLine: "bg-green4",
    writingOnChainStep: "border-amber6 text-amber10",
  },
};

function ConfirmationAlert({ handleSubmit }: { handleSubmit: () => void }) {
  return (
    <div className="mt-4 px-1">
      <div className="w-full space-y-6">
        <h1 className="text-amber9 my-2 text-xl">Are you sure?</h1>
        <span className=" text-slate12">
          This procedure will cost gas fee. You make sure there is no data to
          change before updating.{" "}
        </span>
      </div>
      <div className="mt-7 flex gap-5">
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Cancel</Button>
        </DialogPrimitive.Close>
        <Button shade="light" onClick={() => handleSubmit()}>
          I'm sure
        </Button>
      </div>
    </div>
  );
}

function StepCircle({
  classNames,
  children,
}: PropsWithChildren<{ classNames: string }>) {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        "font-bold text-lg border-[1px]",
        classNames
      )}
    >
      {children}
    </div>
  );
}

function Line({ classNames }: { classNames: string }) {
  return <div className={cn("h-[1px] w-20", classNames)} />;
}

function ProgressLine({ stage }: { stage: Stage }) {
  return (
    <div className="mt-44 flex items-center justify-center">
      <StepCircle classNames={stage.pinningStep}>1</StepCircle>
      <Line classNames={stage.transitionLine} />
      <StepCircle classNames={stage.writingOnChainStep}>2</StepCircle>
    </div>
  );
}

function Loading() {
  return (
    <div className="border-6 mx-2 h-4 w-4 animate-spin rounded-full border-solid border-amber6 border-l-slate7"></div>
  );
}

function ToastContent({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link?: string;
}) {
  return (
    <div className="flex h-14 flex-row items-center justify-between px-4 py-8">
      <div className="flex flex-col justify-between space-y-1">
        <h1 className="text-xl font-medium text-slate12">{title}</h1>
        <h3 className="mb-2 leading-3 text-slate12">{description}</h3>
      </div>
      {link && (
        <a target="_blank" href={link}>
          <ArrowTopRightIcon width={24} height={24} />
        </a>
      )}
    </div>
  );
}

function ProcessTransaction({ poolId }: { poolId: `0x${string}` }) {
  const { metadata } = usePoolMetadata();
  const {
    handleTransaction,
    isNotifierOpen,
    isTransactionDisabled,
    notification,
    transactionStatus,
    setIsNotifierOpen,
    transactionUrl,
  } = useTransaction({ poolId, metadata });

  const stage = STAGE_CN_MAPPING[transactionStatus];

  const modalDescription =
    transactionStatus === TransactionStatus.AUTHORIZING ||
    transactionStatus === TransactionStatus.PINNING
      ? "Pinning the JSON file to IPFS will be necessary for your approval."
      : transactionStatus === TransactionStatus.CONFIRMED
      ? "Congratulations, you have updated your pool metadata."
      : "Now, to finishing, confirm on your wallet to set metadata on-chain. ";

  return (
    <div className="mt-4 px-1">
      <div className="w-full space-y-6">
        <span className="my-5 text-lg text-slate12">{modalDescription}</span>
        <ProgressLine stage={stage} />
        <Toast
          content={
            <ToastContent
              title={notification?.title || ""}
              description={notification?.description || ""}
              link={transactionUrl}
            />
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          variant={notification?.variant}
        />

        <div className="flex justify-center">
          <Button
            onClick={handleTransaction}
            disabled={isTransactionDisabled}
            className={cn(
              "flex justify-center items-center",
              isTransactionDisabled
                ? "w-full text-amber10 border border-amber4"
                : "w-full text-slate12 bg-amber4 hover:bg-amber3 focus-visible:bg-amber3 disabled:bg-amber2"
            )}
          >
            {isTransactionDisabled &&
              transactionStatus !== TransactionStatus.CONFIRMED && <Loading />}
            {transactionStatus}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TransactionModal({
  poolId,
}: React.PropsWithChildren<{
  poolId: `0x${string}`;
}>) {
  const [approved, setApproved] = useState(false);

  function handleSubmit() {
    setApproved(true);
  }

  return approved ? (
    <ProcessTransaction poolId={poolId} />
  ) : (
    <ConfirmationAlert handleSubmit={handleSubmit} />
  );
}
