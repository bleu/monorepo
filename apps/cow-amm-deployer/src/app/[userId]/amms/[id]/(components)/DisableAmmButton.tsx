"use client";

import { toast } from "@bleu/ui";
import { StopIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";

import { Button } from "#/components/Button";
import { Checkbox } from "#/components/Checkbox";
import { Dialog } from "#/components/Dialog";
import { useAmmData } from "#/contexts/ammData";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import {
  AllTransactionArgs,
  TRANSACTION_TYPES,
  WithdrawCoWAMMArgs,
} from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function DisableAmmButton({ ammData }: { ammData: ICowAmm }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog
      title="Disable"
      content={
        <DisableTradingDialogContent ammData={ammData} setIsOpen={setIsOpen} />
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      setIsOpen={setIsOpen}
    >
      <Button
        className="flex items-center gap-1 py-3 px-6"
        variant="destructive"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <StopIcon />
        Disable trading
      </Button>
    </Dialog>
  );
}

function DisableTradingDialogContent({
  ammData,
  setIsOpen,
}: {
  ammData: ICowAmm;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { mutateAmm } = useAmmData();
  const [withdrawFunds, setWithdrawFunds] = React.useState(false);
  const { chainId } = useAccount();

  const {
    writeContract,
    writeContractWithSafe,
    status,
    isWalletContract,
    isPonderAPIUpToDate,
  } = useManagedTransaction();

  useEffect(() => {
    if (!isPonderAPIUpToDate) return;

    mutateAmm();
    setIsOpen(false);
  }, [isPonderAPIUpToDate]);

  function onDisableAMM() {
    const txArgs = [
      {
        type: TRANSACTION_TYPES.DISABLE_COW_AMM,
        amm: ammData.order.owner,
        chainId: chainId as ChainId,
        hash: ammData.order.hash,
        version: ammData.version,
      },
    ] as AllTransactionArgs[];

    if (withdrawFunds) {
      txArgs.push({
        type: TRANSACTION_TYPES.WITHDRAW_COW_AMM,
        amm: ammData.order.owner,
        amount0: parseUnits(ammData.token0.balance, ammData.token0.decimals),
        amount1: parseUnits(ammData.token1.balance, ammData.token1.decimals),
        chainId: chainId as ChainId,
      } as WithdrawCoWAMMArgs);
    }

    try {
      if (isWalletContract) {
        writeContractWithSafe(txArgs);
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
    <div className="flex flex-col gap-2 text-background bg-foreground">
      <span>
        This action will halt the automatic rebalancing of your AMM over time.
        You retain the ability to withdraw or deposit funds as needed. If
        desired, you have the option to withdraw all your funds in one single
        transaction.
      </span>
      <Checkbox
        label="Withdraw all funds"
        onChange={() => setWithdrawFunds(!withdrawFunds)}
        checked={withdrawFunds}
        id="withdraw-funds-checkbox"
      />
      <Button
        className="flex items-center gap-1 py-3 px-6"
        variant="destructive"
        onClick={onDisableAMM}
        loading={
          !["final", "idle", "confirmed", "error"].includes(status || "")
        }
        loadingText="Confirming..."
      >
        <StopIcon />
        Disable trading
      </Button>
    </div>
  );
}
