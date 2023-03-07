import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between bg-gray-700 p-4 text-white">
      <div className="mr-5 flex items-center">
        <h1 className="text-lg font-medium tracking-tighter md:text-xl">
          Balancer Pool Metadata
        </h1>
      </div>

      <ConnectButton />
    </div>
  );
}
