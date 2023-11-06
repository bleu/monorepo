import { encodePacked } from "viem";
import { goerli } from "viem/chains";

export type argType = "uint256";

export enum PRICE_CHECKERS {
  FIXED_MIN_OUT = "Fixed Minimum Out Amount",
  UNI_V2 = "Uniswap V2",
}

export const priceCheckerInfoMapping = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]: {
    addresses: {
      [goerli.id]: "0xEB2bD2818F7CF1D92D81810b0d45852bE48E1502",
    },
    arguments: [
      {
        name: "minOut",
        type: "uint256",
        label: "Token to buy minimum amount",
        inputType: "number",
        convertInput: (input: number) => BigInt(input * 1e18), // TODO: BLEU-390
      },
    ],
    name: PRICE_CHECKERS.FIXED_MIN_OUT,
  },
  [PRICE_CHECKERS.UNI_V2]: {
    addresses: {
      [goerli.id]: "0x5d74aFFFd2a0250ABA74D6703Bd8e140534b3F36",
    },
    arguments: [
      {
        name: "allowedSlippageInBps",
        type: "uint256",
        label: "Allowed slippage (%)",
        inputType: "number",
        convertInput: (input: number) => BigInt(input * 100),
      },
    ],
    name: PRICE_CHECKERS.UNI_V2,
  },
} as const;

export function encodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  args: bigint[],
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
