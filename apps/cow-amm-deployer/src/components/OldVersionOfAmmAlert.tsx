"use client";

import { toast } from "@bleu/ui";
import { useState } from "react";

import { Button } from "#/components";
import { AlertCard } from "#/components/AlertCard";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import { buildMigrateToStandaloneVersionArgs } from "#/lib/transactionFactory";

export function OldVersionOfAMMAlert({ ammData }: { ammData: ICowAmm }) {
  const { writeContractWithSafeAsync, status, isWalletContract } =
    useManagedTransaction();

  if (!isWalletContract || !writeContractWithSafeAsync) return;

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
          loading={isLoading || (status !== "final" && status !== "idle")}
          onClick={async () => {
            setIsLoading(true);
            const txArgs = await buildMigrateToStandaloneVersionArgs({
              data: ammData,
            });
            try {
              writeContractWithSafeAsync(txArgs);
            } catch {
              toast({
                title: `Transaction failed`,
                description:
                  "An error occurred while processing the transaction.",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Migrate to new version
        </Button>
      </AlertCard>
    </div>
  );
}
