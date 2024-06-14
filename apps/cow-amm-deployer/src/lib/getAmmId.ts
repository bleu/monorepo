import { Address } from "viem";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { ConstantProductFactoryABI } from "./abis/ConstantProductFactory";
import { COW_CONSTANT_PRODUCT_FACTORY } from "./contracts";

export async function getAmmId({
  chainId,
  userAddress,
  token0Address,
  token1Address,
}: {
  chainId: ChainId;
  userAddress: Address;
  token0Address: Address;
  token1Address: Address;
}): Promise<string> {
  const publicClient = publicClientsFromIds[chainId as ChainId];
  const ammAddress = await publicClient.readContract({
    abi: ConstantProductFactoryABI,
    address: COW_CONSTANT_PRODUCT_FACTORY[chainId as ChainId],
    functionName: "ammDeterministicAddress",
    args: [userAddress, token0Address, token1Address],
  });
  return `${ammAddress}-${userAddress}-${chainId}`;
}
