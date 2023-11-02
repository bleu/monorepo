import { Address } from "@bleu-fi/utils";
import { encodePacked } from "viem";
import { goerli } from "viem/chains";

export type argType = "uint256";

export enum PRICE_CHECKERS {
  FIXED_MIN_OUT = "Fixed Minimum Out",
  UNIV2 = "Uniswap V2",
}

export type PriceCheckerType = {
  [Key in PRICE_CHECKERS]: {
    addresses: {
      [chainId: number]: Address;
    };
    arguments: { name: string; type: argType }[];
    name: string;
  };
};

export const priceCheckerInfoMapping: PriceCheckerType = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]: {
    addresses: {
      [goerli.id]: "0xEB2bD2818F7CF1D92D81810b0d45852bE48E1502",
    },
    arguments: [{ name: "minOut", type: "uint256" }],
    name: "Fixed Minimum Out Amount",
  },
  [PRICE_CHECKERS.UNIV2]: {
    addresses: {
      [goerli.id]: "0x5d74aFFFd2a0250ABA74D6703Bd8e140534b3F36",
    },
    arguments: [{ name: "allowedSlippageInBps", type: "uint256" }],
    name: "Uniswap V2",
  },
};

export function encodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[],
): `0x${string}` {
  const { arguments: priceCheckerArgs } = priceCheckerInfoMapping[priceChecker];
  if (priceCheckerArgs.length !== args.length) {
    throw new Error(`Invalid number of arguments for ${priceChecker}`);
  }
  return encodePacked(
    priceCheckerArgs.map((arg) => arg.type),
    args,
  );
}
