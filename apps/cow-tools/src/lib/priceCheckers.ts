import { encodePacked } from "viem";
import { goerli } from "viem/chains";
import { fixedMinOutSchema, sushiSwapSchema, uniV2Schema } from "./schema";

export type argType = "uint256";

export enum PRICE_CHECKERS {
  FIXED_MIN_OUT = "Fixed Minimum Out Amount",
  UNI_V2 = "Uniswap V2",
  SUSHI_SWAP = "SushiSwap",
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
        convertInput: (input: number, decimals: number) =>
          BigInt(input * 10 ** decimals),
      },
    ],
    name: PRICE_CHECKERS.FIXED_MIN_OUT,
    schema: fixedMinOutSchema,
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
    schema: uniV2Schema,
  },
  [PRICE_CHECKERS.SUSHI_SWAP]: {
    addresses: {
      [goerli.id]: "0x5A5633909060c75e5B7cB4952eFad918c711F587",
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
    name: PRICE_CHECKERS.SUSHI_SWAP,
    schema: sushiSwapSchema,
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
