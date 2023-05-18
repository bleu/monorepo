"use client";

import Image from "next/image";

import ConnectWalletImage from "#/assets/connect-wallet.svg";
import { Dialog } from "#/components/Dialog";
import SearchPoolForm from "#/components/SearchPoolForm";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function ParametersNotSet() {
  const { handleImportPoolParametersById } = useStableSwap();
  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        Please set the initial parameters!
      </div>
      <div className="text-center text-slate11 text-lg">
        Alternatively, import parameters from a pool clicking&nbsp;
        <Dialog
          title="Import pool parameters"
          content={
            <SearchPoolForm
              poolTypeFilter={["Stable", "MetaStable"]}
              onSubmit={handleImportPoolParametersById}
            />
          }
        >
          <span className="cursor-pointer text-slate12"> here</span>
        </Dialog>
      </div>
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
    </div>
  );
}
