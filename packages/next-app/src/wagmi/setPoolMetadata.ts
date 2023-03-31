import { prepareWriteContract, writeContract } from "@wagmi/core";

import { poolMetadataRegistryABI } from "./generated";

const METADATA_CONTRACT_NETWORK_MAP = {
  5: "0xebfadf723e077c80f6058dc9c9202bb613de07cf",
  137: "0x68fd16B6D2D1D4AA042009872b08f3756Cc76261",
} as const;

export async function writeSetPoolMetadata(
  poolId: `0x${string}`,
  metadataCID: string,
  networkId?: keyof typeof METADATA_CONTRACT_NETWORK_MAP
) {
  const config = await prepareWriteContract({
    // TODO(BAL-193): come back here to fix this
    address: METADATA_CONTRACT_NETWORK_MAP[networkId || 5],
    abi: poolMetadataRegistryABI,
    functionName: "setPoolMetadata",
    args: [poolId, metadataCID],
  });

  return await writeContract(config);
}
