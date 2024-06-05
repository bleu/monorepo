import Link from "next/link";

import { Button } from "#/components";
import { OldVersionOfAMMAlert } from "#/components/OldVersionOfAmmAlert";
import { fetchUserAmmsData, ICowAmm } from "#/lib/fetchAmmData";

import { AmmsTable } from "./(components)/AmmsTable";

export default async function Page({ params }: { params: { userId: string } }) {
  const standaloneAmmData = (await fetchUserAmmsData(
    params.userId
  )) as ICowAmm[];
  const oldVersionOfAmm = standaloneAmmData.find(
    (amm) => amm.version !== "Standalone"
  );

  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-2/3 flex-col gap-2">
        {oldVersionOfAmm && <OldVersionOfAMMAlert ammData={oldVersionOfAmm} />}
        <div className="flex justify-between">
          <h1 className="text-2xl text-center">My CoW AMMs</h1>
          <Link href={`/${params.userId}/new`}>
            <Button>New AMM</Button>
          </Link>
        </div>
        <AmmsTable
          standaloneAmmData={standaloneAmmData}
          userId={params.userId}
        />
      </div>
    </div>
  );
}
