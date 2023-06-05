"use client";

import { PropsWithChildren } from "react";

import { Dialog } from "#/components/Dialog";
import SearchPoolForm from "#/components/SearchPoolForm";
import { useStableSwap } from "#/contexts/StableSwapContext";

export function SearchPoolFormDialog({ children }: PropsWithChildren) {
  const { handleImportPoolParametersById } = useStableSwap();

  return (
    <Dialog
      title="Import pool parameters"
      content={
        <SearchPoolForm
          poolTypeFilter={["Stable", "MetaStable", "ComposableStable"]}
          onSubmit={handleImportPoolParametersById}
        />
      }
    >
      {children}
    </Dialog>
  );
}
