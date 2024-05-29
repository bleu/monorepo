"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { LinkComponent } from "#/components/Link";
import { Spinner } from "#/components/Spinner";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { fetchAmmData, ICowAmm } from "#/lib/fetchAmmData";
import { supportedChainIds } from "#/utils/chainsPublicClients";

import { WithdrawForm } from "./(components)/WithdrawForm";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  const [ammData, setAmmData] = useState<ICowAmm>();

  async function loadAmmData() {
    const data = await fetchAmmData(params.id);
    setAmmData(data);
  }
  const { safe, connected } = useSafeAppsSDK();
  useEffect(() => {
    loadAmmData();
  }, [params.id]);

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
  }

  if (!ammData) {
    return <Spinner />;
  }

  return (
    <div className="flex size-full items-center justify-center">
      <div className="my-4 flex flex-col border-2 border-foreground bg-card border-card-foreground text-card-foreground">
        <div className="relative flex size-full justify-center">
          <LinkComponent
            href={`/amms/${params.id}`}
            content={
              <div className="absolute left-8 flex h-full items-center">
                <ArrowLeftIcon
                  height={16}
                  width={16}
                  className="text-background duration-200 hover:text-highlight"
                />{" "}
              </div>
            }
          />
          <div className="flex w-[530px] flex-col items-center py-3">
            <div className="text-xl">Proportional withdraw</div>
          </div>
        </div>
        <div className="flex flex-col w-[530px] overflow-auto size-full max-h-[550px]">
          <WithdrawForm cowAmm={ammData} />
        </div>
      </div>
    </div>
  );
}
