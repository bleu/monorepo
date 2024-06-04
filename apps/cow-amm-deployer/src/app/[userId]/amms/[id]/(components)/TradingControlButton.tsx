"use client";

import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { PlayIcon, StopIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

import { Button } from "#/components/Button";
import { useRawTxData } from "#/hooks/useRawTxData";
import { ICowAmm } from "#/lib/fetchAmmData";
import { DisableCoWAMMArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function TradingControlButton({ ammData }: { ammData: ICowAmm }) {
  if (ammData.disabled) {
    return <EnableAMMButton ammData={ammData} />;
  }
  return <DisableAmmButton ammData={ammData} />;
}

function EnableAMMButton({ ammData }: { ammData: ICowAmm }) {
  return (
    <Link href={`/${ammData.user.id}/amms/${ammData.id}/enable`}>
      <Button className="flex items-center gap-1 py-3 px-6">
        <PlayIcon />
        Enable trading
      </Button>
    </Link>
  );
}

function DisableAmmButton({ ammData }: { ammData: ICowAmm }) {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();
  const { sendTransactions } = useRawTxData();

  async function onDisableAMM() {
    const txArgs = {
      type: TRANSACTION_TYPES.DISABLE_COW_AMM,
      amm: ammData.order.owner,
      chainId: chainId as ChainId,
    } as DisableCoWAMMArgs;
    try {
      await sendTransactions([txArgs]);
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  }

  return (
    <Button
      className="flex items-center gap-1 py-3 px-6"
      variant="destructive"
      onClick={onDisableAMM}
    >
      <StopIcon />
      Disable trading
    </Button>
  );
}
