import { Address } from "@bleu/utils";
import { useEffect, useState } from "react";

import { decodePriceOracleWithData } from "#/lib/decodePriceOracle";
import { PRICE_ORACLES, PriceOracleData } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

type DecodedPriceOracleData = [PRICE_ORACLES, PriceOracleData];

interface UseDecodedPriceOracleWithDataState {
  isLoading: boolean;
  decodedData?: DecodedPriceOracleData;
}

export function useDecodedPriceOracleData({
  priceOracleAddress,
  priceOracleData,
  chainId,
}: {
  priceOracleAddress: Address;
  priceOracleData: Address;
  chainId: ChainId;
}): UseDecodedPriceOracleWithDataState {
  const [state, setState] = useState<UseDecodedPriceOracleWithDataState>({
    isLoading: true,
  });

  useEffect(() => {
    decodePriceOracleWithData({
      address: priceOracleAddress,
      priceOracleData,
      chainId,
    }).then((data) => setState({ isLoading: false, decodedData: data }));
  }, [priceOracleAddress, priceOracleData, chainId]);

  return state;
}
