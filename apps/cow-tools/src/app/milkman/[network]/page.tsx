import { Network } from "@bleu-fi/utils";
import { gql } from "graphql-tag";

import { sdk } from "#/lib/gql/sdk";

import { HomePageWrapper } from "./HomePageWrapper";

gql(`
  query AllSwaps {
    swaps {
      id
      chainId
      transactionHash
      tokenAmountIn
      priceChecker
      user {
        id
      }
      tokenIn {
        id
        name
        symbol
        decimals
      }
      tokenOut {
        id
        name
        symbol
        decimals
      }
    }
  }
`);

export default async function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { swaps: orders } = await sdk.AllSwaps();

  if (!orders.length) {
    return null;
  }

  return <HomePageWrapper params={params} orders={orders} />;
}
