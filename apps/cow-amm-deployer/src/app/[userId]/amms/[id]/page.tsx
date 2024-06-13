import { Address } from "viem";

import { OldVersionOfAMMAlert } from "#/components/OldVersionOfAmmAlert";
import { fetchAmmData } from "#/lib/fetchAmmData";
import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

import { Header } from "./(components)/Header";
import { Manage } from "./(components)/Manage";
import { PoolComposition } from "./(components)/PoolComposition";

export default async function Page({
  params,
}: {
  params: { userId: string; id: string };
}) {
  const ammData = await fetchAmmData(params.id);
  const oldVersionOfAmm = ammData.version !== "Standalone";
  const [walletBalanceToken0, walletBalanceToken1] = await Promise.all([
    fetchWalletTokenBalance({
      token: ammData.token0,
      walletAddress: ammData.user.address as Address,
      chainId: ammData.order.chainId as ChainId,
    }),
    fetchWalletTokenBalance({
      token: ammData.token1,
      walletAddress: ammData.user.address as Address,
      chainId: ammData.order.chainId as ChainId,
    }),
  ]);

  return (
    <div className="w-full flex flex-col space-y-4 px-32">
      <Header ammData={ammData} oldVersionOfAmm={oldVersionOfAmm} />
      {oldVersionOfAmm && <OldVersionOfAMMAlert ammData={ammData} />}
      <div className="flex flex-row w-full space-x-8">
        <div className="w-2/3">
          <Manage
            ammData={ammData}
            oldVersionOfAmm={oldVersionOfAmm}
            walletBalanceToken0={walletBalanceToken0}
            walletBalanceToken1={walletBalanceToken1}
          />
        </div>
        <div className="flex flex-col space-y-4 w-1/3">
          <PoolComposition ammData={ammData} />
        </div>
      </div>
    </div>
  );
}
