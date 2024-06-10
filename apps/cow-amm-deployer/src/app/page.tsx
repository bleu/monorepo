"use client";

import Image from "next/image";
import { useAccount } from "wagmi";

import { Button } from "#/components/Button";
import Fathom from "#/components/Fathom";
import { LinkComponent } from "#/components/Link";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAutoConnect } from "#/hooks/tx-manager/useAutoConnect";
import { supportedChainIds } from "#/utils/chainsPublicClients";

export default function Page() {
  const { address: safeAddress, chainId, isConnected } = useAccount();

  useAutoConnect();

  if (!isConnected) {
    return <WalletNotConnected />;
  }

  if (chainId && !supportedChainIds.includes(chainId)) {
    return <UnsuportedChain />;
  }

  const userId = `${safeAddress}-${chainId}`;

  return (
    <div className="flex size-full justify-center">
      <div className="flex flex-col items-center gap-8 justify-center">
        <Image
          src="/assets/cow-amm.svg"
          height={100}
          width={400}
          alt="CoW AMM Logo"
        />
        <h2 className="text-6xl mt-8 leading-snug text-center w-full font-serif">
          The first <i className="text-purple">MEV-Capturing AMM</i>,
          <br /> brought to you by <i className="text-yellow">CoW DAO</i>
        </h2>
        <span className="text-prose w-3/4 text-lg text-center">
          CoW AMM is a production-ready implementation of an FM-AMM that
          supplies liquidity for trades made on CoW Protocol. Solvers compete
          with each other for the right to trade against the AMM
        </span>
        <LinkComponent href={`/${userId}/amms`}>
          <Button
            size="lg"
            className="flex items-center gap-1 py-8 px-7 text-xl"
            title="Go to the app"
          >
            Go to the app
          </Button>
        </LinkComponent>
        <Fathom />
      </div>
    </div>
  );
}
