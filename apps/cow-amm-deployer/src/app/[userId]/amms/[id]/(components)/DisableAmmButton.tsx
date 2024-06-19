"use client";

import { StopIcon } from "@radix-ui/react-icons";
import React from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";

import { Button } from "#/components/Button";
import { Checkbox } from "#/components/Checkbox";
import { Dialog } from "#/components/Dialog";
import { useAmmData } from "#/contexts/ammDataContext";
import { useTransactionManagerContext } from "#/contexts/transactionManagerContext";
import { ICowAmm } from "#/lib/fetchAmmData";
import {
  AllTransactionArgs,
  TRANSACTION_TYPES,
  WithdrawCoWAMMArgs,
} from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function DisableAmmButton({ ammData }: { ammData: ICowAmm }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAmmUpdating } = useAmmData();

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
        disabled={isAmmUpdating}
      >
        <StopIcon />
        Disable trading
      </Button>
    </Dialog>
  );
}

function DisableTradingDialogContent({
  ammData,
}: {
  ammData: ICowAmm;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { isAmmUpdating } = useAmmData();
  const [withdrawFunds, setWithdrawFunds] = React.useState(false);
  const { chainId } = useAccount();

  const {
    managedTransaction: {
      writeContract,
      writeContractWithSafe,
      isWalletContract,
    },
  } = useTransactionManagerContext();

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

    if (isWalletContract) {
      writeContractWithSafe(txArgs);
    } else {
      // TODO: this will need to be refactored once we have EOAs
      // @ts-ignore
      writeContract(txArgs);
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
        loading={isAmmUpdating}
        loadingText="Confirming..."
      >
        <StopIcon />
        Disable trading
      </Button>
    </div>
  );
}
