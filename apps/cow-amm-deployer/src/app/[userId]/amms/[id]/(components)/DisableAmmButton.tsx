"use client";

import { toast } from "@bleu/ui";
import { StopIcon } from "@radix-ui/react-icons";
import React from "react";
import { useAccount } from "wagmi";

import { Button } from "#/components/Button";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import { DisableCoWAMMArgs, TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function DisableAmmButton({ ammData }: { ammData: ICowAmm }) {
  const { chainId } = useAccount();

  const { writeContract, writeContractWithSafe, status, isWalletContract } =
    useManagedTransaction();

  function onDisableAMM() {
    const txArgs = {
      type: TRANSACTION_TYPES.DISABLE_COW_AMM,
      amm: ammData.order.owner,
      chainId: chainId as ChainId,
      hash: ammData.order.hash,
      version: ammData.version,
    } as DisableCoWAMMArgs;
    try {
      if (isWalletContract) {
        writeContractWithSafe([txArgs]);
      } else {
        // TODO: this will need to be refactored once we have EOAs
        // @ts-ignore
        writeContract(txArgs);
      }
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
      loading={status !== "idle" && status !== "final"}
      loadingText="Confirming..."
    >
      <StopIcon />
      Disable trading
    </Button>
  );
}
