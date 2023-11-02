"use client";

import { Address, Network, networkIdFor } from "@bleu/utils";
import { useContext, useEffect } from "react";

import { NetworksContext } from "#/contexts/networks";

export default function Layout({
  children,
  params,
}: React.PropsWithChildren<{
  params: { poolId: Address; network: Network };
}>) {
  const { setUrlPathNetwork } = useContext(NetworksContext);

  useEffect(() => {
    if (!params.network) return;

    setUrlPathNetwork(Number(networkIdFor(params.network)));
  }, [params.network]);

  return children;
}
