"use client";

import { NetworkChainId, NetworkFromNetworkChainId } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { redirect } from "next/navigation";
import { gnosis, goerli } from "viem/chains";

export default function Page() {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();

  if (chainId == goerli.id || chainId == gnosis.id) {
    redirect(
      `/milkman/${NetworkFromNetworkChainId[chainId as NetworkChainId]}`,
    );
  }
  // TODO: change redirect to default network BLEU-366
  else redirect("/milkman/goerli");
}
