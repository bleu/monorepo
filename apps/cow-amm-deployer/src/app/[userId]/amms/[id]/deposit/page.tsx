import { Address } from "viem";

import { DepositForm } from "#/components/DepositForm";
import { FormPageWrapper } from "#/components/FormPageWrapper";
import { fetchAmmData, ICowAmm } from "#/lib/fetchAmmData";
import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

export default async function Page({
  params,
}: {
  params: { userId: string; id: `0x${string}` };
}) {
  const ammData = (await fetchAmmData(params.id)) as ICowAmm;
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
    <FormPageWrapper
      formTitle="Deposit"
      backHref={`/${params.userId}/amms/${params.id}`}
    >
      <DepositForm
        cowAmmData={ammData}
        walletBalanceToken0={walletBalanceToken0}
        walletBalanceToken1={walletBalanceToken1}
      />
    </FormPageWrapper>
  );
}
