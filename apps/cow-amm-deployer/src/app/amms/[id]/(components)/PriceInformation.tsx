import { Address } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ResultOf } from "gql.tada";

import { useDecodedPriceOracleData } from "#/hooks/useDecodedPriceOracleData";
import { AMM_QUERY } from "#/hooks/useStandaloneAmm";
import { PRICE_ORACLES } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

import { BalancerPriceInformation } from "./BalancerPriceInformation";
import { ChainlinkPriceInformation } from "./ChainlinkPriceInformation";
import { CustomPriceInformation } from "./CustomPriceInformation";
import { SushiV2PriceInformation } from "./SushiV2PriceInformation";
import { UniswapV2PriceInformation } from "./UniswapV2PriceInformation";

export function PriceInformation({
  cowAmm,
}: {
  cowAmm: ResultOf<typeof AMM_QUERY>;
}) {
  const { safe } = useSafeAppsSDK();
  const { isLoading, decodedData } = useDecodedPriceOracleData({
    priceOracleAddress: cowAmm.constantProductData?.priceOracle as Address,
    priceOracleData: cowAmm.constantProductData?.priceOracleData as Address,
    chainId: safe.chainId as ChainId,
  });

  if (isLoading || !decodedData) return <>Loading...</>;

  switch (decodedData[0]) {
    case PRICE_ORACLES.UNI:
      return <UniswapV2PriceInformation cowAmm={cowAmm} />;
    case PRICE_ORACLES.BALANCER:
      return <BalancerPriceInformation cowAmm={cowAmm} />;
    case PRICE_ORACLES.SUSHI:
      return <SushiV2PriceInformation cowAmm={cowAmm} />;
    case PRICE_ORACLES.CHAINLINK:
      return <ChainlinkPriceInformation cowAmm={cowAmm} />;
    default:
      return <CustomPriceInformation cowAmm={cowAmm} />;
  }
}
