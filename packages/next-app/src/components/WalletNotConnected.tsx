import { networkIdEnumMap } from "@balancer-pool-metadata/shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNetwork } from "wagmi";

import ConnectWalletImage from "#/assets/connect-wallet.svg";

import { Dialog } from "./Dialog";
import { PoolAttribute, SearchPoolForm } from "./SearchPoolForm";

export default function WalletNotConnected({
  isInternalManager = false,
}: {
  isInternalManager?: boolean;
}) {
  const { chain } = useNetwork();
  const { push } = useRouter();

  function handleGoToPool(formData: PoolAttribute) {
    const networkId = formData.network ?? chain?.id.toString();
    const networkName =
      networkIdEnumMap[networkId as keyof typeof networkIdEnumMap];
    push(`/metadata/${networkName}/pool/${formData.poolId}`);
  }
  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        Please connect your wallet
      </div>
      {!isInternalManager && (
        <div className="text-center text-slate11 text-lg">
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
