"use client";

import { isArray } from "lodash";
import { redirect, useParams } from "next/navigation";

import { Round } from "#/app/apr/(utils)/rounds";

export default function Page() {
  const { network } = useParams();
  const chain = isArray(network) ? network[0] : network;

  redirect(`/apr/${chain}/round/${Round.getAllRounds()[0].value}`);
}
