import { chains } from "#/wagmi/client";

export function CheckUnsupportedChain({
  children,
  unsupportedChain,
  chainName,
}: React.PropsWithChildren<{
  unsupportedChain?: (typeof chains)[number]["name"];
  chainName?: string;
  isMetadata?: boolean;
}>) {
  if (unsupportedChain && chainName && chainName === unsupportedChain) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-5 h-full">
        <div className="text-3xl font-bold text-white">
          Currently, this app doesn't have support for {unsupportedChain}
        </div>
        <div className="text-xl font-medium text-white">
          Please switch to another network
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
