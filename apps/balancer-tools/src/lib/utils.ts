import { type ClassValue,clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimTrailingValues(
  amountsIn: number[] | string[],
  amountsOut: number[] | string [],
  valueToTrim: number = 100,
): { trimmedIn: number[] | string[]; trimmedOut: number[] | string[] } {
  const lastIndexNonValue = amountsOut
    .slice()
    .reverse()
    .findIndex((value) => value !== valueToTrim);

  const cutIndex =
    lastIndexNonValue !== -1
      ? amountsOut.length - lastIndexNonValue
      : amountsOut.length;

  const trimmedIn = amountsIn.slice(0, cutIndex);
  const trimmedOut = amountsOut.slice(0, cutIndex);

  return { trimmedIn, trimmedOut };
}
