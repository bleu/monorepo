import { Pool } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Mainnet";
import { networkFor } from "@balancer-pool-metadata/shared";
import Link from "next/link";

import { Badge } from "#/components/Badge";
import Sidebar from "#/components/Sidebar";
import { usePoolMetadata } from "#/contexts/PoolMetadataContext";
import { truncateAddress } from "#/utils/truncateAddress";
import { useNetwork } from "#/wagmi";

export function MetadataSidebar() {
  const { chain } = useNetwork();
  const { selectedPool, handleSetPool, poolsData } = usePoolMetadata();
  const network = networkFor(chain!.id.toString());

  return (
    <Sidebar isFloating>
      <Sidebar.Header name="Owned pools" />
      <Sidebar.Content>
        {poolsData &&
          poolsData.map((item) => (
            <Link
              key={item.id}
              href={`/metadata/${network}/pool/${item.id}`}
              onClick={() => handleSetPool(item.id)}
            >
              <Sidebar.Item isSelected={item.id === selectedPool}>
                <OwnedPool
                  isSelected={item.id === selectedPool}
                  pool={item as Pool}
                />
              </Sidebar.Item>
            </Link>
          ))}
      </Sidebar.Content>
    </Sidebar>
  );
}

export function OwnedPool({
  isSelected,
  pool,
}: {
  isSelected: boolean;
  pool: Pool;
}) {
  const { poolType, tokens, name, id } = pool;

  const poolName =
    poolType === "Weighted" && tokens
      ? tokens.map((obj) => obj.symbol).join("/")
      : name;
  const weights =
    poolType === "Weighted" && tokens
      ? tokens.map((obj) => (Number(obj.weight) * 100).toFixed()).join("/")
      : null;

  return (
    <>
      <div className="flex items-center space-x-3 self-stretch">
        <p className="text-lg font-bold text-gray-200 group-hover:text-yellow-400">
          {poolName}
        </p>
        {weights && <Badge isSelected={isSelected}>{weights}</Badge>}
      </div>
      <div className="flex w-full items-center space-x-3">
        <Badge isOutlined>{poolType}</Badge>
        <p className="text-sm leading-tight text-gray-500 group-hover:text-gray-400">
          {truncateAddress(id)}
        </p>
      </div>
    </>
  );
}
