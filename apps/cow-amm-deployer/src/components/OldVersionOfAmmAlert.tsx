"use client";

import { toast } from "@bleu/ui";
import { useState } from "react";

import { Button } from "#/components";
import { AlertCard } from "#/components/AlertCard";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import { buildMigrateToStandaloneVersionArgs } from "#/lib/transactionFactory";

import { Spinner } from "./Spinner";

export function OldVersionOfAMMAlert({ ammData }: { ammData: ICowAmm }) {
  const {
    hash,
    error,
    writeContract,
    writeContractWithSafe,
    status,
    safeHash,
    isWalletContract,
  } = useManagedTransaction();
  // eslint-disable-next-line no-console
  console.log({
    hash,
    error,
    writeContract,
    writeContractWithSafe,
    status,
    safeHash,
    isWalletContract,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-foreground text-background mb-2">
      <AlertCard style="error" title="Old version of the AMM">
        <p>
          A old version of the CoW AMM was detected. There is more gas efficient
          version of the CoW AMM available. Migrate the funds of this AMM to the
          new version clicking on the button bellow.
        </p>
        <Button
          className="mt-2"
          onClick={async () => {
            setIsLoading(true);
            const txArgs = await buildMigrateToStandaloneVersionArgs({
              data: ammData,
            });
            try {
              writeContractWithSafe(txArgs);
            } catch {
              toast({
                title: `Transaction failed`,
                description:
                  "An error occurred while processing the transaction.",
                variant: "destructive",
              });
            }
            setIsLoading(false);
          }}
        >
          {isLoading ? <Spinner size="sm" /> : "Migrate to new version"}
        </Button>
      </AlertCard>
    </div>
  );
}
