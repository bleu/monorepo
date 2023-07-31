"use client";

import { PropsWithChildren } from "react";

import { Dialog } from "#/components/Dialog";
<<<<<<< HEAD
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { usePoolFormContext } from "#/contexts/FormContext";
=======
import { SearchPoolForm } from "#/components/SearchPoolForm";
>>>>>>> main
import { PoolType, usePoolSimulator } from "#/contexts/PoolSimulatorContext";

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
  const onSubmit = (formData: PoolAttribute) => {
    if (isCustomData) {
      handleImportPoolParametersById(formData, setData, false, data);
      return;
    }
    handleImportPoolParametersById(formData, setData);
  };

  return (
    <Dialog
      title="Import pool parameters"
      content={
        <SearchPoolForm
          poolTypeFilter={poolTypes[poolTypeFilter]}
          onSubmit={onSubmit}
          showPools
        />
      }
    >
      {children}
    </Dialog>
  );
}
