"use client";

import { Network, networkIdFor } from "@balancer-pool-metadata/shared";
import { useContext, useEffect } from "react";

import { NetworksContext } from "#/contexts/networks";

export default function Layout({
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
