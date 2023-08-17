"use client";
import { networkFor } from "@bleu-balancer-tools/utils";
import cn from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

export default function ClientSideBodyRow({
  children,
  classNames,
  poolNetwork,
  poolId,
  roundId,
}: React.PropsWithChildren<{
  classNames?: string;
  poolNetwork: number;
  poolId: string;
  roundId: string;
}>) {
  const { push } = useRouter();
  function redirectToPool(network: number, poolID: string, roundID: string) {
    const poolRedirectURL = roundID
      ? `/apr/pool/${networkFor(network)}/${poolID}/round/${roundID}`
      : `/apr/pool/${networkFor(network)}/${poolID}`;
    push(poolRedirectURL);
  }

  return (
    <tr
      onClick={() => {
        redirectToPool(poolNetwork, poolId, roundId);
      }}
      className={cn(classNames)}
    >
      {children}
    </tr>
  );
}
