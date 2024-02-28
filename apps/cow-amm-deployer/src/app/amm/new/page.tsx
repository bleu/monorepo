"use client";

import { Network } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { gnosis } from "viem/chains";

import { LinkComponent } from "#/components/Link";
import WalletNotConnected from "#/components/WalletNotConnected";

import { CreateAmmForm } from "../(components)/CreateAmmForm";

function ArrowIcon() {
  return (
    <ArrowLeftIcon
      height={16}
      width={16}
      className="text-slate10 duration-200 hover:text-amber10"
    />
  );
}

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { safe, connected } = useSafeAppsSDK();

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (safe.chainId !== gnosis.id) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          You are on the wrong network
        </div>
        <div className="text-xl text-white">
          Please change to {params.network}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full items-center justify-center w-full">
        <div className="my-4 flex flex-col rounded-lg border border-slate7 bg-blue3 text-white">
          <div className="divide-y divide-slate7 h-full">
            <div className="relative flex h-full w-full justify-center">
              <LinkComponent
                loaderColor="amber"
                href={`/amm`}
                content={
                  <div className="absolute left-8 flex h-full items-center">
                    <ArrowIcon />
                  </div>
                }
              />

              <div className="flex min-w-[530px] flex-col items-center py-3">
                <div className="text-xl">Create AMM</div>
              </div>
            </div>
            <div className="flex flex-col overflow-auto w-full h-full max-h-[550px]">
              <CreateAmmForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
