import { NetworkFromNetworkChainId } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { gnosis } from "viem/chains";

import { useDecodedPriceOracleData } from "#/hooks/useDecodedPriceOracleData";
import { ICowAmm } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export function UniswapV2PriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { safe } = useSafeAppsSDK();

  const { isLoading, decodedData } = useDecodedPriceOracleData({
    priceOracleAddress: cowAmm.priceOracleAddress,
    priceOracleData: cowAmm.priceOracleData,
    chainId: safe.chainId as ChainId,
  });

  if (isLoading || !decodedData) return <>Loading...</>;

  const priceOracleLink = getUniV2PairUrl(
    safe.chainId as ChainId,
    decodedData[1].uniswapV2PairAddress,
  );

  return (
    <div className="flex flex-row gap-x-1 items-center hover:text-foreground/90">
      <span>Using price information from Uniswap V2</span>
      {priceOracleLink && (
        <Link href={priceOracleLink} target="_blank">
          <ArrowTopRightIcon />
        </Link>
      )}
    </div>
  );
}

export function getUniV2PairUrl(chainId: ChainId, referencePair?: string) {
  if (chainId === gnosis.id) {
    return;
  }
  return `https://info.uniswap.org/#/${NetworkFromNetworkChainId[chainId]}/pools/${referencePair}`;
}
