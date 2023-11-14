import { encodeAbiParameters } from "viem";
import { goerli } from "viem/chains";

import {
  getChainlinkSchema,
  getFixedMinOutSchema,
  getSushiSwapSchema,
  getUniV2Schema,
} from "./schema";

export type argTypeName =
  | "uint256"
  | "address"
  | "bool"
  | "address[]"
  | "bool[]";
export type argType = string | bigint | boolean | string[] | boolean[];

export interface PriceCheckerArgument {
  name: string;
  type: argTypeName;
  label: string;
  inputType: "number" | "text" | "checkbox";
  toExpectedOutCalculator: boolean;
  convertInput: (input: argType | number, decimals?: number) => argType;
}

export enum PRICE_CHECKERS {
  FIXED_MIN_OUT = "Fixed Minimum Out Amount",
  UNI_V2 = "Uniswap V2",
  SUSHI_SWAP = "SushiSwap",
  CHAINLINK = "Chainlink",
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
    ] as PriceCheckerArgument[],
    name: PRICE_CHECKERS.FIXED_MIN_OUT,
    hasExpectedOutCalculator: false,
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
    ] as PriceCheckerArgument[],
    name: PRICE_CHECKERS.UNI_V2,
    hasExpectedOutCalculator: true,
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
    ] as PriceCheckerArgument[],
    name: PRICE_CHECKERS.SUSHI_SWAP,
    hasExpectedOutCalculator: true,
    getSchema: getSushiSwapSchema,
  },
  [PRICE_CHECKERS.CHAINLINK]: {
    addresses: {
      [goerli.id]: "0x81909582e1Ab8a0f8f98C948537528E29a98f116",
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
      {
        name: "addressesPriceFeeds",
        type: "address[]",
        label: "Price feeds",
        inputType: "text",
        toExpectedOutCalculator: false,
        convertInput: (input: string) => input,
      },
      {
        name: "revertPriceFeeds",
        type: "bool[]",
        label: "Revert price feeds",
        inputType: "checkbox",
        toExpectedOutCalculator: false,
        convertInput: (input: boolean) => input,
      },
    ] as PriceCheckerArgument[],
    name: PRICE_CHECKERS.CHAINLINK,
    hasExpectedOutCalculator: true,
    getSchema: getChainlinkSchema,
  },
} as const;

export function encodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  args: argType[],
): `0x${string}` {
  const priceCheckerInfo = priceCheckerInfoMapping[priceChecker];

  validateArguments(priceCheckerInfo.arguments, args);

  if (!priceCheckerInfo.hasExpectedOutCalculator) {
    return encodeArguments(priceCheckerInfo.arguments, args);
  }

  return encodeWithExpectedOutCalculator(priceCheckerInfo.arguments, args);
}

function validateArguments(
  expectedArgs: PriceCheckerArgument[],
  args: argType[],
) {
  if (expectedArgs.length !== args.length || !args.length) {
    throw new Error(`Invalid number of arguments`);
  }
}

function encodeArguments(
  expectedArgs: PriceCheckerArgument[],
  args: argType[],
): `0x${string}` {
  return encodeAbiParameters(
    expectedArgs.map((arg) => ({ name: arg.name, type: arg.type })),
    args,
  );
}

function encodeWithExpectedOutCalculator(
  expectedArgs: PriceCheckerArgument[],
  args: argType[],
): `0x${string}` {
  const firstExpectedOutArgIndex = expectedArgs.findIndex(
    (arg) => arg.toExpectedOutCalculator,
  );

  if (firstExpectedOutArgIndex === -1) {
    encodeWithExpectedOutCalculatorWithoutParameters(expectedArgs, args);
  }

  const mainArgs = expectedArgs.slice(0, firstExpectedOutArgIndex);
  const mainEncoded = encodeArguments(
    mainArgs,
    args.slice(0, firstExpectedOutArgIndex),
  );

  const expectedOutArgs = expectedArgs.slice(firstExpectedOutArgIndex);
  const expectedOutEncoded = encodeArguments(
    expectedOutArgs,
    args.slice(firstExpectedOutArgIndex),
  );

  return `0x${mainEncoded.slice(2)}${expectedOutEncoded.slice(2)}`;
}

function encodeWithExpectedOutCalculatorWithoutParameters(
  expectedArgs: PriceCheckerArgument[],
  args: argType[],
): `0x${string}` {
  const expectedOutData = encodeAbiParameters(
    [{ name: "_data", type: "bytes" }],
    ["0x"],
  );
  return encodeAbiParameters(
    expectedArgs
      .map((arg) => {
        return {
          name: arg.name as string,
          type: arg.type as string,
        };
      })
      .concat([{ name: "_data", type: "bytes" }]),
    args.concat([expectedOutData]),
  );
}
