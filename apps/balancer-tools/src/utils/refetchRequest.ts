import { Address } from "@bleu/utils";
import { useEffect } from "react";

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
