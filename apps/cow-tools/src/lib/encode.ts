import { Address } from "@bleu-fi/utils";
import { dateToEpoch } from "@bleu-fi/utils/date";
import { encodeAbiParameters } from "viem";

import {
  priceCheckerHasExpectedOutCalculatorMapping,
  priceCheckersArgumentsMapping,
} from "./priceCheckersMappings";
import { argType, PRICE_CHECKERS, PriceCheckerArgument } from "./types";

export function encodePriceCheckerDataWithValidFromDecorator({
  priceCheckerAddress,
  priceCheckerData,
  validFrom,
  twapDelay,
}: {
  priceCheckerAddress: Address;
  priceCheckerData: `0x${string}`;
  validFrom: string;
  twapDelay?: number;
}) {
  const validFromDate = new Date(validFrom);
  const validFromTimestamp = BigInt(
    dateToEpoch(validFromDate) + (twapDelay || 0)
  );
  return encodeAbiParameters(
    [
      {
        name: "validFrom",
        type: "uint256",
      },
      {
        name: "_priceChecker",
        type: "address",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    [validFromTimestamp, priceCheckerAddress, priceCheckerData]
  );
}

export function encodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  args: argType[]
): `0x${string}` {
  const priceCheckerArguments = priceCheckersArgumentsMapping[priceChecker];

  validateArguments(priceCheckerArguments, args);

  if (priceChecker === PRICE_CHECKERS.UNI_V3) {
    return encodeUniV3PriceCheckerData(priceCheckerArguments, args);
  }

  if (!priceCheckerHasExpectedOutCalculatorMapping[priceChecker]) {
    return encodeArguments(priceCheckerArguments, args);
  }
  return encodeWithExpectedOutCalculator(priceCheckerArguments, args);
}

function encodeUniV3PriceCheckerData(
  expectedArgs: PriceCheckerArgument[],
  args: argType[]
): `0x${string}` {
  const tokenIn = args[1] as string[];
  const tokenOut = args[2] as string[];
  const fees = args[3] as bigint[];

  if (tokenIn.length !== tokenOut.length || tokenIn.length !== fees.length) {
    throw new Error(`Invalid number of arguments`);
  }

  const swapPath = tokenIn
    .map((token, index) => {
      if (index === 0) {
        return token;
      }
      return tokenOut[index - 1];
    })
    .concat([tokenOut[tokenOut.length - 1]]);

  const expectedOutArgs = [
    {
      name: "swapPath",
      type: "address[]",
    },
    {
      name: "fees",
      type: "uint24[]",
    },
  ];

  const expectedOutEncoded = encodeAbiParameters(expectedOutArgs, [
    swapPath,
    fees,
  ]);

  return encodeAbiParameters(
    expectedArgs
      .slice(0, 1)
      .map((arg) => {
        return {
          name: arg.name as string,
          type: arg.type as string,
        };
      })
      .concat([
        {
          name: "_data",
          type: "bytes",
        },
      ]),
    args.slice(0, 1).concat([expectedOutEncoded])
  );
}

function validateArguments(
  expectedArgs: PriceCheckerArgument[],
  args: argType[]
) {
  if (expectedArgs.length !== args.length || !args.length) {
    throw new Error(`Invalid number of arguments`);
  }
}

function encodeArguments(
  expectedArgs: PriceCheckerArgument[],
  args: argType[]
): `0x${string}` {
  return encodeAbiParameters(
    expectedArgs.map((arg) => ({ name: arg.name, type: arg.type })),
    args
  );
}

export function encodeExpectedOutArguments(
  priceChecker: PRICE_CHECKERS,
  args: argType[]
): `0x${string}` {
  const expectedArgs = priceCheckersArgumentsMapping[priceChecker].filter(
    (arg) => {
      arg.toExpectedOutCalculator;
    }
  );
  if (!expectedArgs.length) {
    return `0x`;
  }
  return encodeArguments(expectedArgs, args);
}

function encodeWithExpectedOutCalculator(
  expectedArgs: PriceCheckerArgument[],
  args: argType[]
): `0x${string}` {
  const firstExpectedOutArgIndex = expectedArgs.findIndex(
    (arg) => arg.toExpectedOutCalculator
  );

  if (firstExpectedOutArgIndex === -1) {
    return encodeWithExpectedOutCalculatorWithoutParameters(expectedArgs, args);
  }

  const expectedOutArgs = expectedArgs.slice(firstExpectedOutArgIndex);
  const expectedOutEncoded = encodeArguments(
    expectedOutArgs,
    args.slice(firstExpectedOutArgIndex)
  );

  const mainArgs = expectedArgs
    .slice(0, firstExpectedOutArgIndex)
    .map((arg) => {
      return {
        name: arg.name as string,
        type: arg.type as string,
      };
    })
    .concat([
      {
        name: "_data",
        type: "bytes",
      },
    ]);

  return encodeAbiParameters(
    mainArgs,
    args.slice(0, firstExpectedOutArgIndex).concat([expectedOutEncoded])
  );
}

function encodeWithExpectedOutCalculatorWithoutParameters(
  expectedArgs: PriceCheckerArgument[],
  args: argType[]
): `0x${string}` {
  return encodeAbiParameters(
    expectedArgs
      .map((arg) => {
        return {
          name: arg.name as string,
          type: arg.type as string,
        };
      })
      .concat([{ name: "_data", type: "bytes" }]),
    args.concat(["0x"])
  );
}
