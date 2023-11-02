"use client";

import cn from "clsx";
import { PropsWithChildren } from "react";

import { TransactionStatus } from "../utils/type";

type Stage = {
  name: TransactionStatus;
  stepNumber: number;
  defaultStepClass: string;
  activeStepClass: string;
  completedStepClass: string;
  defaultLineColor: string;
  activeLineColor: string;
  completedLineColor: string;
  nextStage?: TransactionStatus;
  previousStage?: TransactionStatus;
};

export const stages: Stage[] = [
  {
    name: TransactionStatus.DRAFT_SELECT_TOKENS,
    stepNumber: 1,
    defaultStepClass: "border-slate10 text-slate12",
    activeStepClass: "border-amber10 text-amber10",
    completedStepClass: "border-green10 text-green10",
    defaultLineColor: "bg-slate10",
    activeLineColor: "bg-amber10",
    completedLineColor: "bg-green10",
    nextStage: TransactionStatus.DRAFT_SELECT_PRICE_CHECKER,
  },
  {
    name: TransactionStatus.DRAFT_SELECT_PRICE_CHECKER,
    stepNumber: 2,
    defaultStepClass: "border-slate10 text-slate12",
    activeStepClass: "border-amber10 text-amber10",
    completedStepClass: "border-green10 text-green10",
    defaultLineColor: "bg-slate10",
    activeLineColor: "bg-amber10",
    completedLineColor: "bg-green10",
    nextStage: TransactionStatus.DRAFT_RESUME,
    previousStage: TransactionStatus.DRAFT_SELECT_TOKENS,
  },
  {
    name: TransactionStatus.DRAFT_RESUME,
    stepNumber: 3,
    defaultStepClass: "border-slate10 text-slate12",
    activeStepClass: "border-amber10 text-amber10",
    completedStepClass: "border-green10 text-green10",
    defaultLineColor: "bg-slate10",
    activeLineColor: "bg-amber10",
    completedLineColor: "bg-green10",
    nextStage: TransactionStatus.ORDER_PLACED,
    previousStage: TransactionStatus.DRAFT_SELECT_PRICE_CHECKER,
  },
  {
    name: TransactionStatus.ORDER_PLACED,
    stepNumber: 4,
    defaultStepClass: "border-slate10 text-slate12",
    activeStepClass: "border-amber10 text-amber10",
    completedStepClass: "border-green10 text-green10",
    defaultLineColor: "bg-slate10",
    activeLineColor: "bg-amber10",
    completedLineColor: "bg-green10",
    previousStage: TransactionStatus.DRAFT_SELECT_PRICE_CHECKER,
  },
];

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

export function TransactionProgressBar({
  currentStageName,
  totalSteps,
}: {
  currentStageName: TransactionStatus;
  totalSteps: number;
}) {
  const currentStage = stages.find((stage) => stage.name === currentStageName);

  if (!currentStage) return <></>;

  const elements = [];

  for (let i = 0; i < totalSteps; i++) {
    const stepStage = Object.values(stages).find(
      (stage) => stage.stepNumber === i + 1,
    );
    let stepClass = stepStage?.defaultStepClass || "";
    let lineColor = stepStage?.defaultLineColor || "";

    if (stepStage) {
      if (stepStage.name === currentStageName) {
        stepClass = stepStage.activeStepClass;
        lineColor = stepStage.activeLineColor;
      } else if (
        currentStage.previousStage &&
        stepStage.name === currentStage.previousStage
      ) {
        stepClass = stepStage.completedStepClass;
        lineColor = stepStage.completedLineColor;
      }
    }

    elements.push(<StepCircle classNames={stepClass}>{i + 1}</StepCircle>);

    if (i < totalSteps - 1) {
      elements.push(<Line classNames={lineColor} />);
    }
  }

  return <div className="flex items-center justify-center">{elements}</div>;
}
