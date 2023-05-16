import { Network } from "@balancer-pool-metadata/shared";

export function CheckSupportedChains({
  children,
  supportedChains,
  chainName,
}: React.PropsWithChildren<{
  supportedChains?: Network[];
  chainName?: Network;
  isMetadata?: boolean;
}>) {
  if (supportedChains && chainName && !supportedChains.includes(chainName)) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-5 h-full text-center">
        <div className="text-3xl font-bold text-white">
          Currently, this app doesn't have support for {chainName}
        </div>
        <div className="text-xl font-medium text-white">
          Please switch to another network
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
