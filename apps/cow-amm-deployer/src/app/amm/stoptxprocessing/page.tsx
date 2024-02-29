"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Address } from "viem";

import { Spinner } from "#/components/Spinner";
import { NULL_ACTIVE_ORDER } from "#/hooks/useRunningAmmInfo";
import { cowAmmModuleAbi } from "#/lib/abis/cowAmmModule";
import { COW_AMM_MODULE_ADDRESS } from "#/lib/contracts";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

export default function Page() {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();
  const router = useRouter();

  async function checkIsAmmRunning() {
    const publicClient = publicClientsFromIds[chainId as ChainId];
    return publicClient
      .readContract({
        address: COW_AMM_MODULE_ADDRESS[chainId as ChainId],
        abi: cowAmmModuleAbi,
        functionName: "activeOrders",
        args: [safeAddress as Address],
      })
      .then((activeOrder) => {
        return activeOrder != NULL_ACTIVE_ORDER;
      });
  }

  async function redirectToHomeIfAmmIsNotRunning() {
    const isAmmRunning = await checkIsAmmRunning();
    if (!isAmmRunning) {
      router.push("/amm");
    }
  }
  useEffect(() => {
    const intervalId = setInterval(redirectToHomeIfAmmIsNotRunning, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
      <div className="text-center text-3xl text-amber9">
        The transaction is being processed
      </div>
      <Spinner />
    </div>
  );
}
