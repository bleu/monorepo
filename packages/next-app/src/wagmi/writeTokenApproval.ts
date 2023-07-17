import { Address } from "@bleu-balancer-tools/shared";
import { erc20ABI, prepareWriteContract, writeContract } from "@wagmi/core";
import { parseUnits } from "viem";

import { vaultAddress } from "./generated";

export async function writeTokenApproval({
  tokenAddress,
  tokenAmount,
  tokenDecimals,
}: {
  tokenAddress: Address;
  tokenAmount: string;
  tokenDecimals: number;
}) {
  const config = await prepareWriteContract({
    address: tokenAddress as Address,
    abi: erc20ABI,
    functionName: "approve",
    args: [vaultAddress[5], parseUnits(tokenAmount, tokenDecimals)],
  });

  return await writeContract(config);
}
