"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { LinkComponent } from "#/components/Link";
import { Spinner } from "#/components/Spinner";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useStandaloneAMM } from "#/hooks/useStandaloneAmm";
import { supportedChainIds } from "#/utils/chainsPublicClients";

import { WithdrawForm } from "./(components)/WithdrawForm";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  const { data: cowAmm, loading } = useStandaloneAMM(params.id);

  const { safe, connected } = useSafeAppsSDK();

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!cowAmm || loading) {
    return <Spinner />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
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
          <WithdrawForm cowAmm={cowAmm} />
        </div>
      </div>
    </div>
  );
}
