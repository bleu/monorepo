import { gnosis, mainnet } from "viem/chains";

export function UnsuportedChain() {
  return (
    <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
      <div className="text-center text-3xl text-amber9">
        This app isn't available on this network
      </div>
      <div className="text-xl text-white">
        Please change to {gnosis.name} or {mainnet.name}
      </div>
    </div>
  );
}
