import { Address } from "@bleu-fi/utils";
import { readContract } from "@wagmi/core";

import { checkGaugeMintABI } from "./generated";

export async function readBalToMint({
  gaugeAddress,
}: {
  gaugeAddress: Address;
}) {
  return readContract({
    address: "0x798bd35a5C18D20aE83B0C18D36bC328f2eB7061",
    abi: checkGaugeMintABI,
    // @ts-ignore
    functionName: "queryBalToMint",
    args: [gaugeAddress],
  })
    .then(() => null)
    .catch((error) => {
      return Number(error.cause.reason) * 1e-18;
    });
}
