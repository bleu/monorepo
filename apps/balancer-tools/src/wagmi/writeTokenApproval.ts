import { type Address } from "@bleu-balancer-tools/utils";
import { erc20ABI, prepareWriteContract, writeContract } from "@wagmi/core";

import { vaultAddress } from "./generated";

export async function writeTokenApproval({
  tokenAddress,
  tokenAmount,
}: {
  tokenAddress: Address;
  tokenAmount: bigint;
}) {
  const config = await prepareWriteContract({
    address: tokenAddress as Address,
    abi: erc20ABI,
    functionName: "approve",
    args: [vaultAddress[5], tokenAmount],
  });

  return await writeContract(config);
}
