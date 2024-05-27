import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { gnosis, sepolia } from "viem/chains";

import { priceFeedAbi } from "#/lib/abis/priceFeed";
import { ICowAmm } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

export function ChainlinkPriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { safe } = useSafeAppsSDK();
  const [priceFeed0Link, setPriceFeed0Link] = useState<string>();
  const [priceFeed1Link, setPriceFeed1Link] = useState<string>();

  const fetchPriceFeedLinks = async () => {
    const [priceFeed0Link, priceFeed1Link] = await Promise.all([
      getPriceFeedLink(
        safe.chainId as ChainId,
        cowAmm.priceOracleData.chainlinkPriceFeed0,
      ),
      getPriceFeedLink(
        safe.chainId as ChainId,
        cowAmm.priceOracleData.chainlinkPriceFeed1,
      ),
    ]);
    setPriceFeed0Link(priceFeed0Link);
    setPriceFeed1Link(priceFeed1Link);
  };

  useEffect(() => {
    fetchPriceFeedLinks();
  }, []);
  return (
    <div className="flex flex-row gap-x-1 items-start hover:text-foreground/90">
      <span>Using price information from Chainlink</span>
      {priceFeed0Link && (
        <Link
          href={priceFeed0Link}
          target="_blank"
          className="text-primary hover:text-primary/80 text-xs"
        >
          1
        </Link>
      )}
      {priceFeed1Link && (
        <Link
          href={priceFeed1Link}
          target="_blank"
          className="text-primary hover:text-primary/80 text-xs"
        >
          2
        </Link>
      )}
    </div>
  );
}

export async function getPriceFeedLink(chainId: ChainId, address?: Address) {
  if (!address) return;
  if (chainId === sepolia.id) return;
  const publicClient = publicClientsFromIds[chainId];
  const priceFeedDescription = (await publicClient.readContract({
    address: address,
    abi: priceFeedAbi,
    functionName: "description",
  })) as string;
  const priceFeedPageName = priceFeedDescription
    .replace(" / ", "-")
    .toLowerCase();
  const chainName = chainId === gnosis.id ? "xdai" : "ethereum";

  return `https://data.chain.link/feeds/${chainName}/mainnet/${priceFeedPageName}`;
}
