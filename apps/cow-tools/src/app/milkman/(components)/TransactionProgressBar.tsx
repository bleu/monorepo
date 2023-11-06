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

function createStage(
  name: TransactionStatus,
  stepNumber: number,
  nextStage?: TransactionStatus,
  previousStage?: TransactionStatus
) {
  return {
    name,
    stepNumber,
    defaultStepClass: "border-slate10 text-slate12",
    activeStepClass: "border-amber10 text-amber10",
    completedStepClass: "border-green10 text-green10",
    defaultLineColor: "bg-slate10",
    activeLineColor: "bg-amber10",
    completedLineColor: "bg-green10",
    nextStage,
    previousStage,
  };
}

export const stages: Stage[] = [
  createStage(
    TransactionStatus.ORDER_OVERVIEW,
    1,
    TransactionStatus.ORDER_STRATEGY
  ),
  createStage(
    TransactionStatus.ORDER_STRATEGY,
    2,
    TransactionStatus.ORDER_RESUME,
    TransactionStatus.ORDER_OVERVIEW
  ),
  createStage(
    TransactionStatus.ORDER_RESUME,
    3,
    TransactionStatus.ORDER_PLACED,
    TransactionStatus.ORDER_STRATEGY
  ),
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

export function TransactionProgressBar({
  currentStageName,
  totalSteps,
}: {
  currentStageName: TransactionStatus;
  totalSteps: number;
}) {
  const currentStage = stages.find((stage) => stage.name === currentStageName);

  if (!currentStage) return <></>;

  const elements = Array.from({ length: totalSteps }, (_, i) => {
    const stepNumber = i + 1;
    const stepStage = stages.find((stage) => stage.stepNumber === stepNumber);
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

    const stepCircle = (
      <StepCircle classNames={stepClass}>{stepNumber}</StepCircle>
    );
    const line = i < totalSteps - 1 ? <Line classNames={lineColor} /> : null;

    return (
      <>
        {stepCircle}
        {line}
      </>
    );
  });

  return <div className="flex items-center justify-center">{elements}</div>;
}
