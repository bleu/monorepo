"use client";

import { Spinner } from "#/components/Spinner";
import { useAmmData } from "#/contexts/ammDataContext";

import { Header } from "./(components)/Header";
import { Manage } from "./(components)/Manage";
import { PoolComposition } from "./(components)/PoolComposition";

export default function Page() {
  const { ammData } = useAmmData();

  if (!ammData) {
    return <Spinner />;
  }

  return (
    <div className="w-full flex flex-col space-y-4 px-32">
      <Header />
      <div className="flex flex-row w-full space-x-8">
        <div className="w-2/3">
          <Manage />
        </div>
        <div className="flex flex-col space-y-4 w-1/3">
          <PoolComposition />
        </div>
      </div>
    </div>
  );
}
