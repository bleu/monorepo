import { Address } from "@bleu-fi/utils";

import { ChainId } from "#/utils/chainsPublicClients";

import { COW_API_URL_BY_CHAIN_ID } from ".";

export interface ICowOrder {
  sellToken: Address;
  buyToken: Address;
  receiver: Address;
  sellAmount: number;
  buyAmount: number;
  validTo: number;
  feeAmount: number;
  kind: string;
  partiallyFillable: boolean;
  sellTokenBalance: string;
  buyTokenBalance: string;
  from: Address;
  executedSellAmount?: number;
  executedSellAmountBeforeFees?: number;
  executedBuyAmount?: number;
  executedFeeAmount?: number;
  status: string;
}

export async function getCowOrders(
  userAddress: Address,
  chainId: ChainId,
): Promise<ICowOrder[]> {
  const url = COW_API_URL_BY_CHAIN_ID[chainId];

  return fetch(`${url}/api/v1/account/${userAddress}/orders`, {
    headers: {
      Accept: "application/json",
    },
  }).then((response) => response.json() as Promise<ICowOrder[]>);
}
