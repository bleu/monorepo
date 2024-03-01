import Image from "next/image";
import { gnosis, mainnet } from "viem/chains";

import Button from "./Button";
import { LinkComponent } from "./Link";

export function HomeWrapper({
  isAmmRunning,
  goToSafe = false,
  unsuportedChain = false,
}: {
  isAmmRunning: boolean;
  goToSafe?: boolean;
  unsuportedChain?: boolean;
}) {
  const href = isAmmRunning ? "/manager" : "/new";
  const title = goToSafe
    ? "Open App in Safe"
    : isAmmRunning
      ? "Manage your COW AMM"
      : "Create a COW AMM";

  return (
    <div className="flex w-full justify-center h-full">
      <div className="flex flex-col items-center gap-16 justify-center">
        <Image
          src="/assets/cow-amm.svg"
          height={100}
          width={400}
          alt="CoW Amm Logo"
        />
        <h2 className="text-5xl text-center text-seashell w-2/3">
          The first <i className="text-purple9">MEV-Capturing AMM</i>, brought
          to you by <i className="text-amber9">CoW DAO</i>
        </h2>
        {unsuportedChain ? (
          <span className="text-2xl text-center text-seashell w-2/3">
            This app isn't available on this network. Please change to{" "}
            {gnosis.name} or {mainnet.name}
          </span>
        ) : (
          <LinkComponent
            loaderColor="amber"
            href={
              goToSafe
                ? "https://app.safe.global/share/safe-app?appUrl=http%3A%2F%2Flocalhost%3A3000&chain=eth"
                : href
            }
            content={
              <Button
                className="flex items-center gap-1 py-3 px-6"
                title="Go to the app"
              >
                {title}
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
