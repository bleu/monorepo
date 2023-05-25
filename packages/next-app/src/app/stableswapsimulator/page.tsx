"use client";

import Image from "next/image";

import ConnectWalletImage from "#/assets/connect-wallet.svg";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

import { SearchPoolFormDialog } from "./(components)/SearchPoolFormDialog";

export default function Page() {
  const { isGraphLoading } = useStableSwap();
  if (isGraphLoading) return <Spinner />;
  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        Please set the baseline parameters!
      </div>
      <div className="text-center text-slate11 text-lg">
        Alternatively, import parameters from a pool clicking&nbsp;
        <SearchPoolFormDialog>
          <span className="cursor-pointer text-slate12"> here</span>
        </SearchPoolFormDialog>
      </div>
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
    </div>
  );
}
