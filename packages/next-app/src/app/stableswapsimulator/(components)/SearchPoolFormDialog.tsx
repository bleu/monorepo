"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

import { Dialog } from "#/components/Dialog";
import SearchPoolForm, { PoolAttribute } from "#/components/SearchPoolForm";
import { useStableSwap } from "#/contexts/StableSwapContext";

export function SearchPoolFormDialog({ children }: PropsWithChildren) {
  const { push } = useRouter();
  const { handleImportPoolParametersById, setAreParamsLoading } =
    useStableSwap();

  function onSubmit(data: PoolAttribute) {
    setAreParamsLoading(true);
    handleImportPoolParametersById(data);
    push("/stableswapsimulator/analysis");
  }
  return (
    <Dialog
      title="Import pool parameters"
      content={
        <SearchPoolForm
          poolTypeFilter={["Stable", "MetaStable"]}
          onSubmit={onSubmit}
        />
      }
    >
      {children}
    </Dialog>
  );
}
