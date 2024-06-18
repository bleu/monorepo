import { Address } from "viem";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { ConstantProductFactoryABI } from "./abis/ConstantProductFactory";
import { COW_CONSTANT_PRODUCT_FACTORY } from "./contracts";

export async function fetchAmmIsDeployed({
  chainId,
  user,
  token0,
  token1,
}: {
  chainId: ChainId;
  user: Address;
  token0: Address;
  token1: Address;
}): Promise<{
  isDeployed: boolean;
  address: Address;
}> {
  const publicClient = publicClientsFromIds[chainId];
  const cowAmmAddress = await publicClient.readContract({
    abi: ConstantProductFactoryABI,
    address: COW_CONSTANT_PRODUCT_FACTORY[chainId],
    functionName: "ammDeterministicAddress",
    args: [user, token0, token1],
  });
  const contractByteCode = await publicClient.getBytecode({
    address: cowAmmAddress,
  });
  return { isDeployed: !!contractByteCode, address: cowAmmAddress };
}
