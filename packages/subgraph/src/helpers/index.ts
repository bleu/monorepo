import { Address, Bytes } from "@graphprotocol/graph-ts";

export function getPoolAddress(poolId: string): Bytes {
  return Address.fromHexString(poolId.slice(0, 42));
}
