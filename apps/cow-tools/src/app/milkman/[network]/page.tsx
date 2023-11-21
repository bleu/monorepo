"use client";

import { Network } from "@bleu-fi/utils";

import { Spinner } from "#/components/Spinner";
import { useUserOrders } from "#/hooks/useUserOrders";

import { HomePageWrapper } from "./HomePageWrapper";

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { orders, loaded } = useUserOrders();

  if (!loaded) {
    return <Spinner />;
  }

  return <HomePageWrapper params={params} orders={orders} />;
}
