import { Network } from "@bleu-balancer-tools/utils";
import { gql } from "graphql-tag";
import * as React from "react";

import { sdk } from "#/gql/sdk";

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
      }
      tokenOut {
        id
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
