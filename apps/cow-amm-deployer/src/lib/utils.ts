import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function loadDEXPriceCheckerErrorText(priceOracle: string) {
  return `No ${priceOracle} Pool with at least $1,000 TVL were found for the selected tokens.`;
}
