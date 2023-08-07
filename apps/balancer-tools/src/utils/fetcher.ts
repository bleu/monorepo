import type { Address } from "@bleu-balancer-tools/utils";
import { useEffect } from "react";

export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export function useRefetchRequest({
  mutate,
  userAddress,
  chainId,
}: {
  mutate: () => void;
  userAddress: Address;
  chainId?: string;
}) {
  useEffect(() => {
    mutate();
  }, [userAddress, chainId, mutate]);
}
