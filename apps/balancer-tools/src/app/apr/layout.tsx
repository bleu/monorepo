"use client";

import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import invariant from "tiny-invariant";

import { Header } from "#/components/Header";
import { SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";

const ROUNDS = [
  {
    value: "1",
    label: "1 - 10/10/2023",
  },
  // OPEN QUESTION: will this also have a "latest" option?
  // or would that be a separate page?
  // or would that separate page redirect to whatever the latest round is e.g. /round/53
];

export default function Layout({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const { roundId, poolId } = useParams();

  invariant(!Array.isArray(roundId), "roundId cannot be a list");

  return (
    <div className="flex h-full flex-col">
      <Header
        linkUrl={"/apr"}
        title={"Pool Simulator"}
        imageSrc={"/assets/balancer-symbol.svg"}
        endButton={<></>}
      />
      <div className="flex flex-1">
        <SearchPoolForm
          showPools
          onSubmit={(value) =>
            router.push(`/apr/pool/${value.network}/${value.poolId}`)
          }
        />
        <Select
          theme="dark"
          value={roundId ?? ""}
          onValueChange={(value) => router.push(`/apr/round/${value}`)}
          defaultValuePool={poolId}
        >
          {ROUNDS.map((round) => (
            <SelectItem key="roundId" value={round.value}>
              {round.label}
            </SelectItem>
          ))}
        </Select>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
