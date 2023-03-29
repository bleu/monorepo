import Image from "next/image";
import { usePathname } from "next/navigation";

import ConnectWalletImage from "#/assets/connect-wallet.svg";

export default function WalletNotConnected() {
  const pathname = usePathname();
  const message =
    pathname === "/metadata"
      ? "metadata pools"
      : pathname === "/daoadmin"
      ? "actions"
      : "";

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
      <h1 className="flex h-12 items-center text-center text-3xl font-medium not-italic text-gray-400">
        Your {message} will appear here
      </h1>
      <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-300">
        Please, connect your wallet
      </h1>
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
    </div>
  );
}
