import { Address } from "@bleu-balancer-tools/utils";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { ethers } from "ethers";
import { encodeFunctionData } from "viem";
import { goerli } from "viem/chains";

import { milkmanAbi } from "#/abis/milkman";
import { FIXED_MIN_OUT_PRICE_CHECKER_MAP } from "#/utils/addressesMap";

// MIlkman Address is the same for all chains supported chains
export const MILKMAN_ADDRESS = "0x11C76AD590ABDFFCD980afEC9ad951B160F02797";

function encodeFixedMinOutPriceChecker(minOut: bigint) {
  return ethers.utils.defaultAbiCoder.encode(["uint256"], [minOut]);
}

export function getRequestSwapExactTokensForTokensTx(
  tokenAddressToSell: Address,
  tokenAddressToBuy: Address,
  toAddress: Address,
  amount: bigint,
  minOut: bigint,
): BaseTransaction {
  // TODO: Handle multiple price checkers when implement the second one
  // and multiple networks
  const priceChecker = FIXED_MIN_OUT_PRICE_CHECKER_MAP[goerli.id];
  const priceCheckerData = encodeFixedMinOutPriceChecker(minOut);
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
        priceChecker,
        priceCheckerData,
      ],
    }),
  };
}
