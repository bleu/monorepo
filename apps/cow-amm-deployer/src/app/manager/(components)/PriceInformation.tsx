import { ICowAmm, PRICE_ORACLES } from "#/lib/types";

import { BalancerPriceInformation } from "./BalancerPriceInformation";
import { CustomPriceInformation } from "./CustomPriceInformation";
import { SushiV2PriceInformation } from "./SushiV2PriceInformation";
import { UniswapV2PriceInformation } from "./UniswapV2PriceInformation";

export function PriceInformation({ cowAmm }: { cowAmm: ICowAmm }) {
  switch (cowAmm.priceOracle) {
    case PRICE_ORACLES.UNI:
      return <UniswapV2PriceInformation cowAmm={cowAmm} />;
    case PRICE_ORACLES.BALANCER:
      return <BalancerPriceInformation cowAmm={cowAmm} />;
    case PRICE_ORACLES.SUSHI:
      return <SushiV2PriceInformation cowAmm={cowAmm} />;
    default:
      return <CustomPriceInformation cowAmm={cowAmm} />;
  }
}
