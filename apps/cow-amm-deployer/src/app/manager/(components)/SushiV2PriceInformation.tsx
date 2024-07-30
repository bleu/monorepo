import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ICowAmm } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export function SushiV2PriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { safe } = useSafeAppsSDK();

  const priceOracleLink = getSushiV2Pair(
    safe.chainId as ChainId,
    cowAmm.priceOracleData?.sushiSwapPairAddress,
  );

  return (
    <div className="flex flex-row gap-x-1 items-center">
      <span>Using price information from Sushi V2</span>
      {priceOracleLink && (
        <Link href={priceOracleLink} target="_blank">
          <ArrowTopRightIcon />
        </Link>
      )}
    </div>
  );
}

export function getSushiV2Pair(chainId: ChainId, referencePair?: string) {
  return `https://www.sushi.com/pool/${[chainId]}%3A${referencePair}`;
}
