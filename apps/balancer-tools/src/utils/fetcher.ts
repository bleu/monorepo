import { Address } from "@bleu-balancer-tools/utils";
import { useEffect } from "react";

export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export function refetchRequest({
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
  }, [userAddress, chainId]);
}
