import { prepareWriteContract, writeContract } from "@wagmi/core";

import { poolMetadataRegistryABI } from "./generated";

export async function writeSetPoolMetadata(
  poolId: `0x${string}`,
  metadataCID: string
) {
  const config = await prepareWriteContract({
    address: "0xebfadf723e077c80f6058dc9c9202bb613de07cf",
    abi: poolMetadataRegistryABI,
    functionName: "setPoolMetadata",
    args: [poolId, metadataCID],
  });
  
  return await writeContract(config);
}
