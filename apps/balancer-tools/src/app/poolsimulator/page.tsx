"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

import { SearchPoolFormDialog } from "./(components)/SearchPoolFormDialog";

enum dataStatus {
  NONE = "none",
  IMPORTED = "imported",
}

export default function Page() {
  const { isGraphLoading, initialData } = usePoolSimulator();
  const [poolDataStatus, setPoolDataStatus] = useState<dataStatus>(
    dataStatus.NONE
  );

  const { poolType } = usePoolSimulator();

  const content = {
    [dataStatus.NONE]: {
      title: "Please set the initial parameters!",
      subtitle: (
        <>
          Alternatively, import parameters from a pool clicking&nbsp;
          <SearchPoolFormDialog poolTypeFilter={poolType}>
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
            <SearchPoolFormDialog poolTypeFilter={poolType}>
              <span className="cursor-pointer text-slate12">here</span>
            </SearchPoolFormDialog>
          </span>
        </div>
      ),
    },
  };
  useEffect(() => {
    if (initialData.poolType) {
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
          <Image
            src={"/assets/connect-wallet.svg"}
            height={500}
            width={500}
            alt=""
          />
        </div>
      )}
    </div>
  );
}
