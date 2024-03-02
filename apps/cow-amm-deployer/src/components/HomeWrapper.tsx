import Image from "next/image";

import { Button } from "./Button";
import { LinkComponent } from "./Link";

export function HomeWrapper({
  isAmmRunning,
  goToSafe = false,
}: {
  isAmmRunning: boolean;
  goToSafe?: boolean;
}) {
  const href = isAmmRunning ? "/manager" : "/new";
  const title = goToSafe
    ? "Open App in Safe"
    : isAmmRunning
      ? "Manage your CoW AMM"
      : "Create a CoW AMM";

  return (
    <div className="flex w-full justify-center h-full">
      <div className="flex flex-col items-center gap-16 justify-center">
        <Image
          src="/assets/cow-amm.svg"
          height={100}
          width={400}
          alt="CoW Amm Logo"
        />
        <h2 className="text-6xl leading-snug text-center w-full font-serif">
          The first <i className="text-purple">MEV-Capturing AMM</i>,
          <br /> brought to you by <i className="text-yellow">CoW DAO</i>
        </h2>
        <LinkComponent
          href={
            goToSafe
              ? "https://app.safe.global/share/safe-app?appUrl=http%3A%2F%2Flocalhost%3A3000&chain=sep"
              : href
          }
          content={
            <Button
              size="lg"
              className="flex items-center gap-1 py-8 px-7 text-xl"
              title="Go to the app"
            >
              {title}
            </Button>
          }
        />
      </div>
    </div>
  );
}
