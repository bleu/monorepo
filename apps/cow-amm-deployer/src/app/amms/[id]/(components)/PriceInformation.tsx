"use client";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ICowAmm } from "#/lib/fetchAmmData";
import { PRICE_ORACLES } from "#/lib/types";

function PriceInformationComponent({
  label,
  urls,
}: {
  label: string;
  urls: string[];
}) {
  return (
    <div className="flex flex-row gap-x-1 items-center hover:text-foreground/90">
      <span>{label}</span>
      {urls.map((url, index) => (
        <Link key={index} href={url} target="_blank">
          <ArrowTopRightIcon />
        </Link>
      ))}
    </div>
  );
}

export function PriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  const { decodedPriceOracleData, priceFeedLinks } = cowAmm;

  const labels = {
    [PRICE_ORACLES.UNI]: "Using price information from Uniswap V2",
    [PRICE_ORACLES.BALANCER]: "Using price information from Balancer V2",
    [PRICE_ORACLES.SUSHI]: "Using price information from Sushi V2",
    [PRICE_ORACLES.CHAINLINK]: "Using price information from Chainlink",
    default: "Using price information from custom contract",
  } as const;

  const priceOracle = decodedPriceOracleData[0];
  // @ts-ignore
  const label = labels[priceOracle] || labels.default;

  return <PriceInformationComponent label={label} urls={priceFeedLinks} />;
}
