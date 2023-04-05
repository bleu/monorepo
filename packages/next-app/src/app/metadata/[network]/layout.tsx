"use client";

import { Network } from "@balancer-pool-metadata/shared";
import { useContext, useEffect } from "react";

import { NetworksContext } from "#/contexts/networks";
import { networkIdFor } from "#/lib/networkFor";

export default function Page({
  children,
  params,
}: React.PropsWithChildren<{
  params: { poolId: `0x${string}`; network: Network };
}>) {
  const { setUrlPathNetwork } = useContext(NetworksContext);

  useEffect(() => {
    if (!params.network) return;

    setUrlPathNetwork(Number(networkIdFor(params.network)));
  }, [params.network]);

  return children;
}
