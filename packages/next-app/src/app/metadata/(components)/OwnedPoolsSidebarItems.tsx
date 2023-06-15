import {
  Pool,
  PoolsWhereOwnerQuery,
} from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
import {
  Address,
  networkFor,
  networkIdFor,
} from "@balancer-pool-metadata/shared";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import EmptyWalletImage from "#/assets/empty-wallet.svg";
import { Badge } from "#/components/Badge";
import Sidebar from "#/components/Sidebar";
import { impersonateWhetherDAO, pools } from "#/lib/gql";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";
import { truncate } from "#/utils/truncate";
import { useAccount, useNetwork } from "#/wagmi";

export default function OwnedPoolsWrapper() {
  const { chain } = useNetwork();

  const { isConnected, ...rest } = useAccount();

  let address = rest.address;

  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const chainId = networkIdFor(chain?.id?.toString?.());

  if (!isConnected || !chainId || !address)
    return (
      <span className="text-slate11">You need to connect a wallet first.</span>
    );

  return (
    <OwnedPoolsSidebarItems owner={address} chainId={chain!.id?.toString?.()} />
  );
}

function OwnedPoolsSidebarItems({
  owner,
  chainId,
}: {
  owner: Address;
  chainId: string;
}) {
  const { poolId } = useParams();

  const { data, mutate } = pools
    .gql(chainId)
    .usePoolsWhereOwner({ owner }, { suspense: true });

  refetchRequest({
    mutate,
    chainId: chainId,
    userAddress: owner,
  });

  const network = networkFor(chainId);

  if (!data?.pools?.length)
    return (
      <>
        <div className="text-slate12">No pools here!</div>
        <div className="mb-4 text-amber10">Please select another network.</div>
        <Image src={EmptyWalletImage} height={500} width={500} alt="" />
      </>
    );

  return (
    <div className="flex flex-col gap-y-1 pr-2">
      {data?.pools.map(
        (item: ArrElement<GetDeepProp<PoolsWhereOwnerQuery, "pools">>) => (
          <Link key={item.id} href={`/metadata/${network}/pool/${item.id}`}>
            <Sidebar.Item isSelected={item.id === poolId}>
              <PoolCard isSelected={item.id === poolId} pool={item as Pool} />
            </Sidebar.Item>
          </Link>
        )
      )}
    </div>
  );
}

function PoolCard({ isSelected, pool }: { isSelected: boolean; pool: Pool }) {
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
    <div className="py-2">
      <div className="flex items-center space-x-3 self-stretch">
        <p className="break-all text-lg font-bold text-slate12">{poolName}</p>
        {weights && <Badge isSelected={isSelected}>{weights}</Badge>}
      </div>
      <div className="flex w-full items-center space-x-3">
        <Badge variant="outline">{poolType}</Badge>
        <p className="text-sm leading-tight text-slate12 group-hover:text-slate12">
          {truncate(id)}
        </p>
      </div>
    </div>
  );
}
