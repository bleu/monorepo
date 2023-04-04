import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import Link from "next/link";
import { useNetwork } from "wagmi";

import { Badge } from "#/components/Badge";
import Sidebar from "#/components/Sidebar";
import { usePoolMetadata } from "#/contexts/PoolMetadataContext";
import { networkFor } from "#/lib/gql";
import { truncateAddress } from "#/utils/truncateAddress";

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
  const { poolType, tokens, name, address } = pool;

  const poolName =
    poolType === "Weighted" && tokens
      ? tokens.map((obj) => obj.symbol).join("/")
      : name;
  const weights =
    poolType === "Weighted" && tokens
      ? tokens.map((obj) => (Number(obj.weight) * 100).toFixed()).join("/")
      : null;

  return (
    <Sidebar.Item isSelected={isSelected}>
      <div className="flex items-center space-x-3 self-stretch">
        <p className="text-lg font-bold text-gray-200 group-hover:text-yellow-400">
          {poolName}
        </p>
        {weights && <Badge isSelected={isSelected}>{weights}</Badge>}
      </div>
      <div className="flex w-full items-center space-x-3">
        <Badge isOutlined>{poolType}</Badge>
        <p className="text-sm leading-tight text-gray-500 group-hover:text-gray-400">
          {truncateAddress(address)}
        </p>
      </div>
    </Sidebar.Item>
  );
}
