import { type PropsWithChildren } from "react";

import { Dialog } from "#/components/Dialog";
import {
  type PoolAttribute,
  SearchPoolForm,
} from "#/components/SearchPoolForm";
import { type PoolType } from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../(types)";

const poolTypes = {
  [PoolTypeEnum.MetaStable]: ["Stable", "MetaStable", "ComposableStable"],
  [PoolTypeEnum.GyroE]: ["GyroE"],
  [PoolTypeEnum.Gyro2]: ["Gyro2"],
  [PoolTypeEnum.Gyro3]: ["Gyro3"],
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
