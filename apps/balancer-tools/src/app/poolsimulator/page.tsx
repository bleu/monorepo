"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

enum dataStatus {
  NONE = "none",
  IMPORTED = "imported",
}

export default function Page() {
  const { isGraphLoading, initialData, customData } = usePoolSimulator();
  const [poolDataStatus, setPoolDataStatus] = useState<dataStatus>(
    dataStatus.NONE
  );

  const content = {
    [dataStatus.NONE]: {
      title: "Please set the initial parameters!",
      subtitle: (
        <>
          Alternatively, import parameters from a pool clicking on the search
          button
        </>
      ),
    },
    [dataStatus.IMPORTED]: {
      title: "Your parameters were successfully imported!",
      subtitle: (
        <div className="flex flex-col">
          Feel free to change them or directly go to the next step.
          <span>
            Alternatively, import parameters from another pool clicking on the
            search button
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
  // return (
  //   <div className="flex h-full w-full flex-col justify-center rounded-3xl">
  //     {isGraphLoading || poolDataStatus === dataStatus.NONE ? (
  //       <Spinner />
  //     ) : (
  //       <div className="flex flex-col items-center">
  //         <div className="text-center text-3xl text-amber9">
  //           {content[poolDataStatus].title}
  //         </div>
  //         <div className="text-center text-lg text-slate11">
  //           {content[poolDataStatus].subtitle}
  //         </div>
  //         <Image
  //           src={"/assets/connect-wallet.svg"}
  //           height={500}
  //           width={500}
  //           alt=""
  //         />
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div>
      {[initialData, customData].map((data) => {
        return (
          <div className="flex lg:max-h-[calc(100vh-132px)] w-full flex-col gap-y-20 lg:overflow-auto pr-8 pt-8">
            {/* (h-screen - (header's height + footer's height)) = graph's height space */}
            <div className="text-slate12">{data.poolType}</div>
            <div>
              {data.poolParams
                ? Object.entries(data.poolParams).map(([key, value]) => {
                    return (
                      <div className="flex items-center gap-x-4">
                        <span className="text-slate12">{key}</span>
                        <span className="text-slate12">{value}</span>
                      </div>
                    );
                  })
                : null}
            </div>
            <div>
              {data.tokens.map((token, index) => {
                return (
                  <div className="flex items-center gap-x-4">
                    <span className="text-slate12">index</span>
                    <span className="text-slate12">{index}</span>
                    <span className="text-slate12">Symbol</span>
                    <span className="text-slate12">{token.symbol}</span>
                    <span className="text-slate12">Balance</span>
                    <span className="text-slate12">{token.balance}</span>
                    <span className="text-slate12">Rate</span>
                    <span className="text-slate12">{token.rate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
