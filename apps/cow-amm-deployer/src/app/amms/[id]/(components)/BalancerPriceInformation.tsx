import { NetworkFromNetworkChainId } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { useDecodedPriceOracleData } from "#/hooks/useDecodedPriceOracleData";
import { ICowAmm } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export function BalancerPriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { safe } = useSafeAppsSDK();

  const { isLoading, decodedData } = useDecodedPriceOracleData({
    priceOracleAddress: cowAmm.priceOracleAddress,
    priceOracleData: cowAmm.priceOracleData,
    chainId: safe.chainId as ChainId,
  });

  if (isLoading || !decodedData) {
    return <span>Loading price information...</span>;
  }

  const priceOracleLink = getBalancerPoolUrl(
    safe.chainId as ChainId,
    decodedData[1].balancerPoolId,
  );

  return (
    <div className="flex flex-row gap-x-1 items-center hover:text-foreground/90">
      <span>Using price information from Balancer V2</span>
      {priceOracleLink && (
        <Link href={priceOracleLink} target="_blank">
          <ArrowTopRightIcon />
        </Link>
      )}
    </div>
  );
}

export function getBalancerPoolUrl(chainId: ChainId, poolId?: string) {
  return `https://app.balancer.fi/#/${NetworkFromNetworkChainId[chainId]}-chain/pool/${poolId}`;
}
