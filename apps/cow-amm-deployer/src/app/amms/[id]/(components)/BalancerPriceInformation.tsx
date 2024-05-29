import { Address, NetworkFromNetworkChainId } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import { decodePriceOracleWithData } from "#/lib/decodePriceOracle";
import { ICowAmm, PRICE_ORACLES, PriceOracleData } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

type DecodedPriceOracleData = [PRICE_ORACLES, PriceOracleData];

interface UseDecodedPriceOracleWithDataState {
  loading: boolean;
  decodedData?: DecodedPriceOracleData;
}

function useDecodedPriceOracleWithData({
  priceOracleAddress,
  priceOracleData,
  chainId,
}: {
  priceOracleAddress: Address;
  priceOracleData: Address;
  chainId: ChainId;
}): UseDecodedPriceOracleWithDataState {
  const [state, setState] = useState<UseDecodedPriceOracleWithDataState>({
    loading: true,
  });

  useEffect(() => {
    decodePriceOracleWithData({
      address: priceOracleAddress,
      priceOracleData,
      chainId,
    }).then((data) => setState({ loading: false, decodedData: data }));
  }, [priceOracleAddress, priceOracleData, chainId]);

  return state;
}

export function BalancerPriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { safe } = useSafeAppsSDK();

  const { loading, decodedData } = useDecodedPriceOracleWithData({
    priceOracleAddress: cowAmm.priceOracleAddress,
    priceOracleData: cowAmm.priceOracleData,
    chainId: safe.chainId as ChainId,
  });

  if (loading || !decodedData) {
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
