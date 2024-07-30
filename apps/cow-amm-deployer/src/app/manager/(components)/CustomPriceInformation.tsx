import { buildBlockExplorerAddressURL } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ICowAmm } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export function CustomPriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { safe } = useSafeAppsSDK();

  const priceOracleLink = buildBlockExplorerAddressURL({
    chainId: safe.chainId as ChainId,
    address: cowAmm.priceOracleAddress,
  });

  return (
    <div className="flex flex-row gap-x-1 items-center">
      <span>Using price information from custom contract</span>
      {priceOracleLink && (
        <Link href={priceOracleLink.url} target="_blank">
          <ArrowTopRightIcon />
        </Link>
      )}
    </div>
  );
}
