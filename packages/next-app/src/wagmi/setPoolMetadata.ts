import { Address } from "@balancer-pool-metadata/shared";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { poolMetadataRegistryABI } from "./generated";

const NETWORK_METADATA_CONTRACT_MAP = {
  5: "0x3D2C019C906C36fB05e6Ca28395E9E7d603d6CA0",
  137: "0x68fd16B6D2D1D4AA042009872b08f3756Cc76261",
} as const;

export async function writeSetPoolMetadata(
  poolId: Address,
  metadataCID: string,
  networkId?: keyof typeof NETWORK_METADATA_CONTRACT_MAP
) {
  const config = await prepareWriteContract({
    // TODO(BAL-193): come back here to fix this
    address: NETWORK_METADATA_CONTRACT_MAP[networkId || 5],
    abi: poolMetadataRegistryABI,
    functionName: "setPoolMetadata",
    args: [poolId, metadataCID],
  });

  return await writeContract(config);
}
