import { Button } from "#/components";
import { LinkComponent } from "#/components/Link";
import { OldVersionOfAMMAlert } from "#/components/OldVersionOfAmmAlert";
import { TxPendingAlertCard } from "#/components/TxPendingAlertCard";
import { fetchUserAmmsData, ICowAmm, validateUserId } from "#/lib/fetchAmmData";
import { fetchHasAmmTxPending } from "#/lib/fetchHasAmmTxPending";

import { AmmsTable } from "./(components)/AmmsTable";

export default async function Page({ params }: { params: { userId: string } }) {
  const [userAddress, chainId] = validateUserId(params.userId);

  const [standaloneAmmData, hasAmmTxPending] = await Promise.all([
    fetchUserAmmsData(params.userId) as Promise<ICowAmm[]>,
    fetchHasAmmTxPending({ address: userAddress, chainId }) as Promise<boolean>,
  ]);

  const oldVersionOfAmm = standaloneAmmData.find(
    (amm) => amm.version !== "Standalone",
  );

  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-2/3 flex-col gap-2">
        {oldVersionOfAmm && <OldVersionOfAMMAlert ammData={oldVersionOfAmm} />}
        {hasAmmTxPending && <TxPendingAlertCard />}
        <div className="flex justify-between">
          <h1 className="text-2xl text-center">My CoW AMMs</h1>
          <LinkComponent href={`/${params.userId}/new`}>
            <Button>New AMM</Button>
          </LinkComponent>
        </div>
        <AmmsTable
          standaloneAmmData={standaloneAmmData}
          userId={params.userId}
        />
      </div>
    </div>
  );
}
