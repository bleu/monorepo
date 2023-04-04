import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import Link from "next/link";
import { useContext } from "react";
import { useNetwork } from "wagmi";

import { PoolMetadataContext } from "#/contexts/PoolMetadataContext";
import { networkFor } from "#/lib/gql";

import { OwnedPool } from "./OwnedPool";

export function Sidebar({ pools }: { pools: Pool[] }) {
  const { selectedPool, handleSetPool } = useContext(PoolMetadataContext);
  const { chain } = useNetwork();
  const network = networkFor(chain!.id.toString());

  return (
    <div className="h-full w-96 max-w-full bg-gray-900 p-5">
      <div className="w-full max-w-full items-start justify-start space-y-4">
        <div className="items-start justify-start space-y-2.5 self-stretch bg-gray-900 px-2">
          <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
            <span>Owned pools</span>
          </div>
        </div>
        <div className="relative max-h-[40rem] self-stretch overflow-auto rounded-md border border-gray-700 bg-gray-800">
          {pools &&
            pools.map((item) => (
              <Link
                key={item.id}
                href={`/metadata/${network}/pool/${item.id}`}
                onClick={() => handleSetPool(item.id)}
              >
                <OwnedPool
                  key={item.id}
                  isSelected={item.id === selectedPool}
                  pool={item as Pool}
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
