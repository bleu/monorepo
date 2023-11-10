import { encodeAbiParameters } from "viem";
import { goerli } from "viem/chains";

import {
  fixedMinOutSchema,
  getFixedMinOutSchema,
  getSushiSwapSchema,
  getUniV2Schema,
  sushiSwapSchema,
  uniV2Schema,
} from "./schema";

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
        toExpectedOutCalculator: false,
      },
    ],
    name: PRICE_CHECKERS.FIXED_MIN_OUT,
    hasExpectedOutCalculator: false,
    schema: fixedMinOutSchema,
    getSchema: getFixedMinOutSchema,
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
        toExpectedOutCalculator: false,
      },
    ],
    name: PRICE_CHECKERS.UNI_V2,
    hasExpectedOutCalculator: true,

    schema: uniV2Schema,
    getSchema: getUniV2Schema,
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
        toExpectedOutCalculator: false,
      },
    ],
    name: PRICE_CHECKERS.SUSHI_SWAP,
    hasExpectedOutCalculator: true,

    schema: sushiSwapSchema,
    getSchema: getSushiSwapSchema,
  },
} as const;

export function encodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  args: bigint[],
): `0x${string}` {
  const { arguments: priceCheckerArgs, hasExpectedOutCalculator } =
    priceCheckerInfoMapping[priceChecker];
  if (priceCheckerArgs.length !== args.length || !args.length) {
    throw new Error(`Invalid number of arguments for ${priceChecker}`);
  }

  if (!hasExpectedOutCalculator) {
    return encodeAbiParameters(
      priceCheckerArgs.map((arg) => {
        return {
          name: arg.name,
          type: arg.type,
        };
      }),
      args,
    );
  }

  const firstExpectedOutArgIndex = priceCheckerArgs.findIndex(
    (arg) => arg.toExpectedOutCalculator,
  );

  const expectedOutData =
    firstExpectedOutArgIndex == -1
      ? encodeAbiParameters([{ name: "_data", type: "bytes" }], ["0x"])
      : encodeAbiParameters(
          priceCheckerArgs.slice(firstExpectedOutArgIndex).map((arg) => {
            return {
              name: arg.name,
              type: arg.type,
            };
          }),
          args.slice(firstExpectedOutArgIndex),
        );

  const priceCheckerArgsToEncode =
    firstExpectedOutArgIndex == -1
      ? priceCheckerArgs
      : priceCheckerArgs.slice(0, firstExpectedOutArgIndex);
  const argsToEncode =
    firstExpectedOutArgIndex == -1
      ? args
      : args.slice(0, firstExpectedOutArgIndex);
  return encodeAbiParameters(
    priceCheckerArgsToEncode
      .map((arg) => {
        return {
          name: arg.name as string,
          type: arg.type as string,
        };
      })
      .concat([{ name: "_data", type: "bytes" }]),
    // @ts-ignore
    argsToEncode.concat([expectedOutData]),
  );
}
