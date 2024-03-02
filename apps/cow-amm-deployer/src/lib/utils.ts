import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { cowTokenList } from "#/utils/cowTokenList";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tokenUrlRoot =
  "https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/images";

export const cowprotocolTokenLogoUrl = (address: string, chainId: number) =>
  `${tokenUrlRoot}/${chainId}/${address}/logo.png`;

export function getTokenLogoUri(
  tokenAddress: string | undefined,
  chainId: number | undefined,
) {
  if (!tokenAddress || !chainId) return null;

  return cowTokenList.find(
    (token) =>
      token.address.toLowerCase() === tokenAddress?.toLocaleLowerCase() &&
      token.chainId === chainId,
  )?.logoURI;
}
