import Image from "next/image";

import ConnectWalletImage from "#/assets/connect-wallet.svg";
import SearchPoolForm from "#/components/SearchPoolForm";
import { usePoolMetadata } from "#/contexts/PoolMetadataContext";

import { Dialog } from "./Dialog";

export default function WalletNotConnected({
  isInternalManager = false,
}: {
  isInternalManager?: boolean;
}) {
  const { handleGoToPool } = usePoolMetadata();

  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        Please connect your wallet
      </div>
      {!isInternalManager && (
        <div className="text-center text-slate11 text-lg">
          {/* TODO: */}
          Alternatively, open a pool directly clicking&nbsp;
          <Dialog
            title="Go to pool"
            content={<SearchPoolForm onSubmit={handleGoToPool} />}
          >
            <span className="cursor-pointer text-slate12"> here</span>
          </Dialog>
        </div>
      )}
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
    </div>
  );
}
