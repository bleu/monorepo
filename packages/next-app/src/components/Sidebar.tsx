import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { useState } from "react";
import { useAccount } from "wagmi";

import gql from "../lib/gql";
import { OwnedPool } from "./OwnedPool";

export function Sidebar() {
  const { address } = useAccount();
  const { data } = gql.usePool({
    owner: address,
  });

  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const handleButtonClick = (index: string | null) => {
    setSelectedPool(index === selectedPool ? null : index);
  };

  return (
    <div className="h-full w-96 max-w-full bg-gray-900 p-5">
      <div className="h-screen w-96 max-w-full items-start justify-start space-y-4">
        <div className="items-start justify-start space-y-2.5 self-stretch bg-gray-900 px-2">
          <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
            <span>Owned pools</span>
          </div>
        </div>
        <div className="relative max-h-[40rem] self-stretch overflow-auto rounded-md border border-gray-700 bg-gray-800">
          {data?.pools &&
            data.pools.map((item) => (
              <OwnedPool
                key={item.id}
                onClick={() => handleButtonClick(item.id)}
                isSelected={item.id === selectedPool}
                pool={item as Pool}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
