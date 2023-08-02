import { PropsWithChildren } from "react";

import { Dialog } from "#/components/Dialog";
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { PoolType } from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../(types)";

const poolTypes = {
  [PoolTypeEnum.MetaStable]: ["Stable", "MetaStable", "ComposableStable"],
  [PoolTypeEnum.GyroE]: ["GyroE"],
};
export function SearchPoolFormDialog({
  children,
  poolTypeFilter,
  onSubmit,
}: PropsWithChildren<{
  poolTypeFilter: PoolType;
  onSubmit: (data: PoolAttribute) => void;
}>) {
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
