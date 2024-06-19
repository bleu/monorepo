"use client";

import { useEffect, useState } from "react";
import { Address } from "viem";

import { Button } from "#/components";
import { AlertCard } from "#/components/AlertCard";
import { useTransactionManagerContext } from "#/contexts/transactionManagerContext";
import { ICowAmm } from "#/lib/fetchAmmData";
import { getAmmId } from "#/lib/getAmmId";
import { buildMigrateToStandaloneVersionArgs } from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

import { CreateSuccessDialog } from "./CreateSuccessDialog";

export function OldVersionOfAMMAlert({ ammData }: { ammData: ICowAmm }) {
  const [ammId, setAmmId] = useState<string>();
  const [ammDialogOpen, setAmmDialogOpen] = useState(false);

  const {
    managedTransaction: { writeContractWithSafe, status },
  } = useTransactionManagerContext();
  async function updateAmmId() {
    const ammId = await getAmmId({
      chainId: ammData.chainId as ChainId,
      userAddress: ammData.user.address as Address,
      token0Address: ammData.token0.address as Address,
      token1Address: ammData.token1.address as Address,
    });
    setAmmId(ammId);
  }

  useEffect(() => {
    updateAmmId();
  }, []);

  useEffect(() => {
    if (status === "final" || status === "confirmed") {
      setAmmDialogOpen(true);
    }
  }, [status]);

  return (
    <>
      <CreateSuccessDialog
        isOpen={ammDialogOpen}
        setIsOpen={setAmmDialogOpen}
        userId={ammData.user.id}
        ammId={ammId}
      />
      <div className="bg-foreground text-background mb-2">
        <AlertCard style="error" title="Old version of the AMM">
          <p>
            A old version of the CoW AMM was detected. There is more gas
            efficient version of the CoW AMM available. Migrate the funds of
            this AMM to the new version clicking on the button bellow.
          </p>
          <Button
            className="mt-2"
            loadingText="Migrating..."
            loading={
              !["final", "idle", "confirmed", "error"].includes(status || "")
            }
            onClick={async () => {
              const txArgs = await buildMigrateToStandaloneVersionArgs({
                data: ammData,
              });
              writeContractWithSafe(txArgs);
            }}
          >
            Migrate to new version
          </Button>
        </AlertCard>
      </div>
    </>
  );
}
