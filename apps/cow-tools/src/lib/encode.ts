import { encodeAbiParameters } from "viem";
import {
  priceCheckerHasExpectedOutCalculatorMapping,
  priceCheckersArgumentsMapping,
} from "./priceCheckersMappings";
import { PRICE_CHECKERS, PriceCheckerArgument, argType } from "./types";

export function encodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  args: argType[],
): `0x${string}` {
  const priceCheckerArguments = priceCheckersArgumentsMapping[priceChecker];

  validateArguments(priceCheckerArguments, args);

  if (!priceCheckerHasExpectedOutCalculatorMapping[priceChecker]) {
    return encodeArguments(priceCheckerArguments, args);
  }
  return encodeWithExpectedOutCalculator(priceCheckerArguments, args);
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
    return encodeWithExpectedOutCalculatorWithoutParameters(expectedArgs, args);
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
  return encodeAbiParameters(
    expectedArgs
      .map((arg) => {
        return {
          name: arg.name as string,
          type: arg.type as string,
        };
      })
      .concat([{ name: "_data", type: "bytes" }]),
    args.concat(["0x"]),
  );
}
