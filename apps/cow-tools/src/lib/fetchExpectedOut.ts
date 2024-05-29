import { Address } from "@bleu/utils";
import { FieldValues } from "react-hook-form";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { expectedOutCalculatorAbi } from "./abis/expectedOutCalculator";
import { encodeExpectedOutArguments } from "./encode";
import { fetchTokenInfo } from "./fetchTokenInfo";
import {
  expectedOutCalculatorAddressesMapping,
  priceCheckersArgumentsMapping,
} from "./priceCheckersMappings";
import { PRICE_CHECKERS } from "./types";

export async function fetchExpectedOut({
  chainId,
  priceChecker,
  data,
  sellAmount,
  sellToken,
  buyToken,
}: {
  chainId: ChainId;
  priceChecker: PRICE_CHECKERS;
  data: FieldValues;
  sellAmount: number;
  sellToken: Address;
  buyToken: Address;
}): Promise<number> {
  const expectedArgs = priceCheckersArgumentsMapping[priceChecker]?.filter(
    (arg) => arg.encodingLevel > 0,
  );
  const publicClient = publicClientsFromIds[chainId];

  const argsToEncode = expectedArgs.map((arg) => {
    // @ts-ignore
    return arg.convertInput(data[arg.name]);
  });
  const expectedOutData = encodeExpectedOutArguments(
    priceChecker,
    argsToEncode,
  );
  const expectedOutCalculatorAddress =
    expectedOutCalculatorAddressesMapping[chainId][priceChecker];

  const expectedOut = await publicClient.readContract({
    address: expectedOutCalculatorAddress as Address,
    abi: expectedOutCalculatorAbi,
    functionName: "getExpectedOut",
    args: [sellAmount, sellToken, buyToken, expectedOutData],
  });
  const expectedOutDecimals = await fetchTokenInfo(
    buyToken,
    chainId,
    "decimals",
  );
  return Number(expectedOut) / 10 ** Number(expectedOutDecimals);
}
