"use client";

import { PropsWithChildren } from "react";

import { Dialog } from "#/components/Dialog";
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { PoolType, usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { usePoolFormContext } from "#/contexts/PoolSimulatorFormContext";

import { PoolTypeEnum } from "../(types)";

const poolTypes = {
  [PoolTypeEnum.MetaStable]: ["Stable", "MetaStable", "ComposableStable"],
  [PoolTypeEnum.GyroE]: ["GyroE"],
};
export function SearchPoolFormDialog({
  children,
  poolTypeFilter,
}: PropsWithChildren<{ poolTypeFilter: PoolType }>) {
  const { handleImportPoolParametersById } = usePoolSimulator();
  const { setData, data, isCustomData } = usePoolFormContext();

  return (
    <Dialog
      title="Import pool parameters"
      content={
        <SearchPoolForm
          poolTypeFilter={poolTypes[poolTypeFilter]}
          onSubmit={(formData: PoolAttribute) => {
            handleImportPoolParametersById(
              formData,
              setData,
              !isCustomData,
              data,
            );
          }}
          showPools
        />
      }
    >
      {children}
    </Dialog>
  );
}
