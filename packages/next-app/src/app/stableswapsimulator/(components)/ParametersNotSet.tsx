
import Image from "next/image";

import SearchPoolForm from "#/app/metadata/(components)/SearchPoolForm";
import ConnectWalletImage from "#/assets/connect-wallet.svg";
import { Dialog } from "#/components/Dialog";

export default function ParametersNotSet({
  isInternalManager = false,
}: {
  isInternalManager?: boolean;
}) {
  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        Please set the initial parameters!
      </div>
      {!isInternalManager && (
        <div className="text-center text-slate11 text-lg">
          Alternatively, import parameters from a pool clicking&nbsp;
          <Dialog title="Go to pool" content={<SearchPoolForm />}>
            <span className="cursor-pointer text-slate12"> here</span>
          </Dialog> 
        </div>
      )}
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
    </div>
  );
}
