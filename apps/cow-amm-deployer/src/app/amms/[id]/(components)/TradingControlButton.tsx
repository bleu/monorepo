"use client";

import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { PlayIcon, StopIcon } from "@radix-ui/react-icons";
import React from "react";

import { Button } from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { useRawTxData } from "#/hooks/useRawTxData";
import { ICowAmm } from "#/lib/fetchAmmData";
import {
  DisableCoWAMMArgs,
  EditCoWAMMArgs,
  TRANSACTION_TYPES,
} from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function TradingControlButton({ ammData }: { ammData: ICowAmm }) {
  if (ammData.disabled) {
    return <EnableAMMButton ammData={ammData} />;
  }
  return <DisableAmmButton ammData={ammData} />;
}

function EnableAMMButton({ ammData }: { ammData: ICowAmm }) {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();
  const { sendTransactions } = useRawTxData();
  const [openDialog, setOpenDialog] = React.useState(false);

  async function onEnableAMM() {
    const txArgs = {
      type: TRANSACTION_TYPES.EDIT_COW_AMM,
      amm: ammData.order.owner,
      priceOracleAddress: ammData.priceOracle,
      priceOracleData: ammData.priceOracleData,
      minTradedToken0: ammData.minTradedToken0,
      chainId: chainId as ChainId,
    } as EditCoWAMMArgs;
    try {
      await sendTransactions([txArgs]);
    } catch (e) {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Button
        className="flex items-center gap-1 py-3 px-6"
        onClick={() => setOpenDialog(true)}
      >
        <PlayIcon />
        Enable trading
      </Button>
      <Dialog
        content={
          <div className="flex flex-col gap-3">
            <span className="text-primary-foreground">
              This will enable trading on the AMM with it latest settings. If
              you you want to change the settings, please click here.
            </span>
            <Button
              className="text-center gap-1 py-3 px-6"
              onClick={onEnableAMM}
            >
              Confirm
            </Button>
          </div>
        }
        title="Enable trading"
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
      />
    </>
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
