"use client";

import { Network } from "@bleu/utils";

import { HomePageWrapper } from "./HomePageWrapper";

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  return <HomePageWrapper params={params} />;
}
