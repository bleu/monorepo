"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";

import { Header } from "#/components/Header";
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";

const ROUNDS = [
  {
    value: "1",
    label: "1 - 10/10/2023",
  },
  {
    value: "2",
    label: "2 - 08/08/2023",
  },
];

export default function Layout({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const { roundId, poolId } = useParams();
  const form = useForm<PoolAttribute>();
  const { setValue } = form;
  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(poolId), "poolId cannot be a list");

  React.useEffect(() => {
    if (roundId == "latest") {
      router.push(`/apr/round/${ROUNDS[0].value}`);
    }

    if (!roundId) {
      router.push(`${pathname}/round/${ROUNDS[0].value}`);
    }
  }, [roundId]);

  // invariant(!Array.isArray(roundId), "roundId cannot be a list");

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
          form={form}
          defaultValuePool={poolId}
          onSubmit={(value) => {
            router.push(
              `/apr/pool/${value.network}/${value.poolId}/round/${roundId}`
            );
            setValue("poolId", value.poolId);
          }}
        >
          <div className="relative">
            <label className="mb-2 block text-sm text-slate12">Round</label>
            <Select
              value={roundId ?? ""}
              onValueChange={(value) => {
                router.push(!poolId ? `/apr/round/${value}` : `${value}`);
              }}
              className="w-full"
            >
              {ROUNDS.map((round) => (
                <SelectItem key={round.value} value={round.value}>
                  {round.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </SearchPoolForm>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
