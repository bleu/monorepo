"use client";

import cn from "clsx";
import { PropsWithChildren } from "react";

import { TransactionStatus } from "../utils/type";

type Stage = {
  pinningStep: string;
  transitionLine: string;
  writingOnChainStep: string;
};

export const STAGE_CN_MAPPING: Record<TransactionStatus, Stage> = {
  [TransactionStatus.ORDER_PLACED]: {
    pinningStep: "border-amber10 text-amber10",
    transitionLine: "bg-slate10",
    writingOnChainStep: "border-slate10 text-slate12",
  },
  [TransactionStatus.MILKMAN_CREATED]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-amber10 text-amber10",
  },
  [TransactionStatus.TO_BE_EXECUTED]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-amber10 text-amber10",
  },
  [TransactionStatus.EXECUTING]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-amber10 text-amber10",
  },
  [TransactionStatus.EXECUTED]: {
    pinningStep: "border-green10 text-green10",
    transitionLine: "bg-green10",
    writingOnChainStep: "border-green10 text-green10",
  },
  [TransactionStatus.CANCELATION_TO_BE_EXECUTED]: {
    pinningStep: "border-tomato10 text-tomato10",
    transitionLine: "bg-slate10",
    writingOnChainStep: "border-slate10 text-slate12",
  },
  [TransactionStatus.CANCELED]: {
    pinningStep: "border-tomato10 text-tomato10",
    transitionLine: "bg-slate10",
    writingOnChainStep: "border-slate10 text-slate12",
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
        classNames,
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
