"use client";

import cn from "classnames";
import { PropsWithChildren } from "react";

import { TransactionStatus } from "#/hooks/useTransaction";

type Stage = {
  pinningStep: string;
  transitionLine: string;
  writingOnChainStep: string;
};

export const STAGE_CN_MAPPING: Record<TransactionStatus, Stage> = {
  [TransactionStatus.PINNING]: {
    pinningStep: "border-amber10 text-amber10",
    transitionLine: "bg-slate10",
    writingOnChainStep: "border-slate10 text-slate12",
  },
  [TransactionStatus.CONFIRMING]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-amber10 text-amber10",
  },
  [TransactionStatus.SUBMITTING]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-amber10 text-amber10",
  },
  [TransactionStatus.CONFIRMED]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-green10 text-green10",
  },
  [TransactionStatus.PINNING_ERROR]: {
    pinningStep: "border-tomato10 text-tomato10",
    transitionLine: "bg-slate10",
    writingOnChainStep: "border-slate10 text-slate12",
  },
  [TransactionStatus.WRITE_ERROR]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-tomato10 text-tomato10",
  },
  [TransactionStatus.AUTHORIZING]: {
    pinningStep: "border-amber10 text-amber10",
    transitionLine: "bg-slate10",
    writingOnChainStep: "border-slate10 text-slate12",
  },
  [TransactionStatus.WAITING_APPROVAL]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-amber10 text-amber10",
  },
};

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

export function TransactionProgressBar({ stage }: { stage: Stage }) {
  return (
    <div className="flex items-center justify-center">
      <StepCircle classNames={stage.pinningStep}>1</StepCircle>
      <Line classNames={stage.transitionLine} />
      <StepCircle classNames={stage.writingOnChainStep}>2</StepCircle>
    </div>
  );
}
