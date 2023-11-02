import { Address } from "@bleu-balancer-tools/utils";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { encodeFunctionData } from "viem";
import { goerli } from "viem/chains";

import { milkmanAbi } from "#/abis/milkman";

import {
  encodePriceCheckerData,
  PRICE_CHECKERS,
  priceCheckerInfoMapping,
} from "./priceCheckers";

// MIlkman Address is the same for all chains supported chains
export const MILKMAN_ADDRESS = "0x11C76AD590ABDFFCD980afEC9ad951B160F02797";

export function getRequestSwapExactTokensForTokensTx({
  tokenAddressToSell,
  tokenAddressToBuy,
  toAddress,
  amount,
  priceChecker,
  args,
}: {
  tokenAddressToSell: Address;
  tokenAddressToBuy: Address;
  toAddress: Address;
  amount: bigint;
  priceChecker: PRICE_CHECKERS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
}): BaseTransaction {
  const priceCheckerInfo = priceCheckerInfoMapping[priceChecker];
  const priceCheckerAddress = priceCheckerInfo.addresses[goerli.id];
  const priceCheckerData = encodePriceCheckerData(priceChecker, [args]);
  return {
    to: "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
    value: "0",
    data: encodeFunctionData({
      abi: milkmanAbi,
      functionName: "requestSwapExactTokensForTokens",
      args: [
        amount,
        tokenAddressToSell,
        tokenAddressToBuy,
        toAddress,
        priceCheckerAddress,
        priceCheckerData,
      ],
    }),
  };
}
