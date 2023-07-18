"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import ConnectWalletImage from "#/assets/connect-wallet.svg";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/PoolSimulatorContext";

import { SearchPoolFormDialog } from "./(components)/SearchPoolFormDialog";

enum dataStatus {
  NONE = "none",
  IMPORTED = "imported",
}

const content = {
  [dataStatus.NONE]: {
    title: "Please set the initial parameters!",
    subtitle: (
      <>
        Alternatively, import parameters from a pool clicking&nbsp;
        <SearchPoolFormDialog>
          <span className="cursor-pointer text-slate12">here</span>
        </SearchPoolFormDialog>
      </>
    ),
  },
  [dataStatus.IMPORTED]: {
    title: "Your parameters were successfully imported!",
    subtitle: (
      <div className="flex flex-col">
        Feel free to change them or directly go to the next step.
        <span>
          Alternatively, import parameters from another pool clicking&nbsp;
          <SearchPoolFormDialog>
            <span className="cursor-pointer text-slate12">here</span>
          </SearchPoolFormDialog>
        </span>
      </div>
    ),
  },
};

export default function Page() {
  const { isGraphLoading, initialData } = useStableSwap();
  const [poolDataStatus, setPoolDataStatus] = useState<dataStatus>(
    dataStatus.NONE
  );
  useEffect(() => {
    if (initialData.ampFactor) {
      setPoolDataStatus(dataStatus.IMPORTED);
    } else {
      setPoolDataStatus(dataStatus.NONE);
    }
  }, [initialData]);
  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl">
      {isGraphLoading || poolDataStatus === dataStatus.NONE ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-center text-3xl text-amber9">
            {content[poolDataStatus].title}
          </div>
          <div className="text-center text-lg text-slate11">
            {content[poolDataStatus].subtitle}
          </div>
          <Image src={ConnectWalletImage} height={500} width={500} alt="" />
        </div>
      )}
    </div>
  );
}
