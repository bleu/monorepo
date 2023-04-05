import {
  DELEGATE_OWNER,
  Network,
  networkFor,
  networkMultisigs,
} from "@balancer-pool-metadata/shared";

export function isPoolOwner(
  chainId: string,
  poolOwner: string | undefined | false,
  connectedAddress?: `0x${string}` | undefined
): boolean {
  const network = networkFor(chainId);

  if (!connectedAddress || !poolOwner) {
    return false;
  }

  if (connectedAddress.toUpperCase() === DELEGATE_OWNER.toUpperCase()) {
    return false;
  }

  if (connectedAddress.toUpperCase() === poolOwner.toUpperCase()) {
    return true;
  }

  if (network !== Network.Goerli && networkMultisigs[network]) {
    const isMultisigOwner =
      networkMultisigs[network].toUpperCase() ===
      connectedAddress.toUpperCase();

    if (isMultisigOwner) {
      return true;
    }
  }

  return false;
}
