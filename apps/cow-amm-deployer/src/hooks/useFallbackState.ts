import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { useEffect, useState } from "react";
import { Address } from "viem";

import { gpV2SettlementAbi } from "#/lib/abis/gpv2Settlement";
import { signatureVerifierMuxerAbi } from "#/lib/abis/signatureVerifierMuxer";
import {
  COMPOSABLE_COW_ADDRESS,
  SETTLEMENT_CONTRACT_ADDRESS,
} from "#/lib/contracts";
import { FALLBACK_STATES } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

export async function fetchDomainSeparator({
  safe,
}: {
  safe: SafeInfo;
}): Promise<Address> {
  const publicClient = publicClientsFromIds[safe.chainId as ChainId];
  return publicClient.readContract({
    address: SETTLEMENT_CONTRACT_ADDRESS,
    abi: gpV2SettlementAbi,
    functionName: "domainSeparator",
  });
}

// Reference: https://github.com/cowprotocol/cowswap/blob/c6614eadc51635a316343d30dffe41fe90cb62a2/apps/cowswap-frontend/src/modules/twap/services/verifyExtensibleFallback.ts#L9
export async function fetchFallbackState({
  safe,
  domainSeparator,
}: {
  safe: SafeInfo;
  domainSeparator: Address;
}): Promise<FALLBACK_STATES> {
  const publicClient = publicClientsFromIds[safe.chainId as ChainId];

  try {
    const domainVerifier = await publicClient.readContract({
      address: safe.safeAddress as Address,
      abi: signatureVerifierMuxerAbi,
      functionName: "domainVerifiers",
      args: [safe.safeAddress as Address, domainSeparator],
    });
    if (
      domainVerifier.toLocaleLowerCase() ===
      COMPOSABLE_COW_ADDRESS.toLocaleLowerCase()
    ) {
      return FALLBACK_STATES.HAS_DOMAIN_VERIFIER;
    }
    return FALLBACK_STATES.HAS_EXTENSIBLE_FALLBACK;
  } catch (error) {
    return FALLBACK_STATES.HAS_NOTHING;
  }
}

export function useFallbackState() {
  const { safe } = useSafeAppsSDK();
  const [fallbackState, setFallbackState] = useState<FALLBACK_STATES>();
  const [domainSeparator, setDomainSeparator] = useState<Address>();

  useEffect(() => {
    fetchDomainSeparator({ safe }).then(setDomainSeparator);
  }, [safe]);

  useEffect(() => {
    if (!domainSeparator) return;
    fetchFallbackState({ safe, domainSeparator }).then(setFallbackState);
  }, [safe, domainSeparator]);

  return { safe, fallbackState, domainSeparator };
}
