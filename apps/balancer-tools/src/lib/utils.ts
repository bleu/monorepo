import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimTrailingValues(
  amountsIn: (number | string)[],
  amountsOut: (number | string)[],
  valueToTrim: number | string = 100,
): { trimmedIn: (number | string)[]; trimmedOut: (number | string)[] } {
  let cutIndex = amountsOut.length;

  for (let i = amountsOut.length - 1; i >= 0; i--) {
    if (amountsOut[i] !== valueToTrim) {
      break;
    }
    cutIndex--;
  }

  const trimmedIn = amountsIn.slice(0, cutIndex);
  const trimmedOut = amountsOut.slice(0, cutIndex);

  return { trimmedIn, trimmedOut };
}
