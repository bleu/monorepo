import { Network } from "@balancer-pool-metadata/balancer-gql/codegen";

import { DELEGATE_OWNER, networkFor, networkMultisigs } from "#/lib/gql";

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

  if (network !== Network.goerli && networkMultisigs[network]) {
    const isMultisigOwner =
      networkMultisigs[network].toUpperCase() ===
      connectedAddress.toUpperCase();

    if (isMultisigOwner) {
      return true;
    }
  }

  return false;
}
