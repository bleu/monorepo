import { Address, decodeAbiParameters } from "viem";

import { ChainId } from "#/utils/chainsPublicClients";

import {
  expectedOutCalculatorAddressesMapping,
  priceCheckerAddressesMapping,
  priceCheckerHasExpectedOutCalculatorMapping,
  priceCheckersArgumentsMapping,
} from "./priceCheckersMappings";
import {
  argType,
  argTypeName,
  PRICE_CHECKERS,
  PriceCheckerArgument,
} from "./types";

export function decodePriceCheckerData(
  priceChecker: PRICE_CHECKERS,
  data: `0x${string}`,
): argType[] {
  try {
    const expectedArgs = priceCheckersArgumentsMapping[priceChecker];

    if (!priceCheckerHasExpectedOutCalculatorMapping[priceChecker]) {
      return decodeArguments(expectedArgs, data);
    }

    return decodeWithExpectedOutCalculator(expectedArgs, data);
  } catch {
    return [];
  }
}

export function getPriceCheckerFromAddressAndChain(
  chainId: ChainId,
  priceCheckerAddress: Address,
  addressIsFromExpectedOutCalculator: boolean = false,
): PRICE_CHECKERS | null {
  // Find Price checker info dict from priceCheckerAddressesMapping constant
  // using the address and chainId provided
  // Those two keys combination should be unique
  // If not found, return null
  const mapping = addressIsFromExpectedOutCalculator
    ? expectedOutCalculatorAddressesMapping
    : priceCheckerAddressesMapping;
  const priceCheckerInfo = Object.entries(mapping[chainId]).find(
    ([_key, address]) => address === priceCheckerAddress,
  );

  if (!priceCheckerInfo) {
    return null;
  }

  return priceCheckerInfo[0] as PRICE_CHECKERS;
}

function decodeArguments(
  expectedArgs: (PriceCheckerArgument | { name: string; type: argTypeName })[],
  data: `0x${string}`,
): argType[] {
  return decodeAbiParameters(
    expectedArgs.map((arg) => ({ name: arg.name, type: arg.type })),
    data,
  ) as argType[];
}

function decodeWithExpectedOutCalculator(
  expectedArgs: PriceCheckerArgument[],
  data: `0x${string}`,
): argType[] {
  const firstExpectedOutArgIndex = expectedArgs.findIndex(
    (arg) => arg.toExpectedOutCalculator,
  );

  if (firstExpectedOutArgIndex === -1) {
    return decodeArguments(
      [...expectedArgs, { name: "_data", type: "bytes" }],
      data,
    ).slice(0, -1);
  }

  const mainArgs = expectedArgs.slice(0, firstExpectedOutArgIndex);

  const mainDecoded = decodeArguments(
    [...mainArgs, { name: "_data", type: "bytes" }],
    data,
  );

  const expectedOutArgs = expectedArgs.slice(firstExpectedOutArgIndex);
  const expectedOutDecoded = decodeArguments(
    expectedOutArgs,
    mainDecoded[mainDecoded.length - 1] as `0x${string}`,
  );

  return mainDecoded.concat(expectedOutDecoded);
}

export function decodeExpectedOutArgumentsOnMetaPriceChecker(
  data: `0x${string}`,
): argType[] {
  return decodeArguments(
    [
      { name: "priceChecker", type: "address" },
      { name: "expectedOutCalculator", type: "address" },
      { name: "expectedOutCalculatorData", type: "bytes" },
      { name: "_data", type: "bytes" },
      { name: "expectedOut", type: "uint256" },
    ],
    data,
  );
}
