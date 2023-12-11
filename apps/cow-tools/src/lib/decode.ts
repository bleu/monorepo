import { Address, decodeAbiParameters } from "viem";

import { ChainId } from "#/utils/chainsPublicClients";
import { truncateAddress } from "#/utils/truncate";

import {
  convertOutputListOfAddresses,
  expectedOutCalculatorAddressesMapping,
  priceCheckerAddressesMapping,
  priceCheckerHasExpectedOutCalculatorMapping,
  priceCheckersArgumentsMapping,
  validFromDecorator,
} from "./priceCheckersMappings";
import {
  argType,
  argTypeName,
  PRICE_CHECKERS,
  PriceCheckerArgument,
} from "./types";

export function decodePriceCheckerData(
  priceChecker: PRICE_CHECKERS | "Valid From Decorator",
  data: `0x${string}`,
  chainId: ChainId,
): argType[] {
  try {
    const expectedArgs = getExpectedArgumentsFromPriceChecker(
      priceChecker,
      data,
      chainId,
    );

    const encodingLevels = expectedArgs.map((arg) => arg.encodingLevel);
    const uniqueEncodingLevels = [...new Set(encodingLevels)];
    const decodedData = [] as argType[];
    let remainingData = data;
    uniqueEncodingLevels.forEach((index) => {
      const expectedArgsAtLevel = expectedArgs.filter(
        (arg) => arg.encodingLevel == index,
      );
      const expectedArgsToDecode =
        index + 1 === uniqueEncodingLevels.length
          ? expectedArgsAtLevel
          : expectedArgsAtLevel.concat({
              name: "_data",
              type: "bytes",
              encodingLevel: index,
            });

      const decodedAtLevel = decodeArguments(
        expectedArgsToDecode,
        remainingData,
      );

      if (index + 1 === uniqueEncodingLevels.length) {
        decodedData.push(...decodedAtLevel);
        return;
      }

      decodedData.push(...decodedAtLevel.slice(0, -1));
      remainingData = decodedAtLevel[
        decodedAtLevel.length - 1
      ] as `0x${string}`;
    });
    return decodedData;
  } catch {
    return [];
  }
}

export function priceCheckerHasExpectedOutCalculator(
  priceChecker: PRICE_CHECKERS | "Valid From Decorator",
): boolean {
  if (priceChecker == "Valid From Decorator") {
    return true;
  }
  return priceCheckerHasExpectedOutCalculatorMapping[priceChecker];
}

export function getExpectedArgumentsFromPriceChecker(
  priceChecker: PRICE_CHECKERS | "Valid From Decorator",
  data: `0x${string}`,
  chainId: ChainId,
): PriceCheckerArgument[] {
  if (priceChecker == "Valid From Decorator") {
    const validFromExpectedArgs = [
      {
        name: "validFrom",
        type: "uint256",
        label: "Valid From",
        encodingLevel: 0,
        convertOutput: (output: string) => {
          const date = new Date(Number(output) * 1000);
          return date.toLocaleString();
        },
      },
      {
        name: "priceChecker",
        type: "address",
        label: "Price Checker on decorator",
        encodingLevel: 0,
        convertOutput: (output: string) =>
          getPriceCheckerFromAddressAndChain(
            chainId,
            output as `0x${string}`,
            false,
          ) + ` (${truncateAddress(output as `0x${string}`)})`,
      },
      {
        name: "_data",
        type: "bytes",
        encodingLevel: 0,
      },
    ] as PriceCheckerArgument[];

    const priceCheckerAddress = decodeArguments(validFromExpectedArgs, data)[1];
    const priceCheckerInDecorator = getPriceCheckerFromAddressAndChain(
      chainId,
      priceCheckerAddress as Address,
    );
    if (priceCheckerInDecorator == null) {
      return [];
    }
    const priceCheckerExpectedArgs = getExpectedArgumentsFromPriceChecker(
      priceCheckerInDecorator,
      data,
      chainId,
    ).map((arg) => {
      return { ...arg, encodingLevel: arg.encodingLevel + 1 };
    });
    return validFromExpectedArgs.slice(0, -1).concat(priceCheckerExpectedArgs);
  }

  if (priceChecker == PRICE_CHECKERS.UNI_V3) {
    return [
      {
        name: "allowedSlippageInBps",
        type: "uint256",
        label: "Allowed slippage (%)",
        convertOutput: (output: bigint) => Number(output) / 100,
        encodingLevel: 0,
      },
      {
        name: "swapPath",
        type: "address[]",
        label: "Swap Path",
        convertOutput: convertOutputListOfAddresses,
        encodingLevel: 1,
      },
      {
        name: "fees",
        type: "uint24[]",
        label: "Fees (%)",
        encodingLevel: 1,
        convertOutput: (outputs: bigint[]) =>
          outputs.map((output) => Number(output) / 100),
      },
    ] as PriceCheckerArgument[];
  }
  const expectedArgs = priceCheckersArgumentsMapping[priceChecker];
  const needBytesArg =
    expectedArgs.every((arg) => arg.encodingLevel == 0) &&
    priceCheckerHasExpectedOutCalculator(priceChecker);
  return needBytesArg
    ? expectedArgs.concat([
        {
          name: "_data",
          type: "bytes",
          encodingLevel: 0,
          label: "Expected Out Calculator Data",
        },
      ])
    : expectedArgs;
}

export function getPriceCheckerFromAddressAndChain(
  chainId: ChainId,
  priceCheckerAddress: Address,
  addressIsFromExpectedOutCalculator: boolean = false,
): PRICE_CHECKERS | "Valid From Decorator" | null {
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
    if (priceCheckerAddress == validFromDecorator[chainId]) {
      return "Valid From Decorator";
    }
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
