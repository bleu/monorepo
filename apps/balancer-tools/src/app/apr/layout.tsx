"use client";

import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";

import { Header } from "#/components/Header";
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";

import { Round } from "./(utils)/rounds";

const ALL_ROUNDS = Round.getAllRounds();
const LAST_ROUND_ID = ALL_ROUNDS[0].value;

export default function Layout({ children }: React.PropsWithChildren) {
  const router = useRouter();

  const { roundId, poolId } = useParams();
  const form = useForm<PoolAttribute>();
  const { setValue } = form;

  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(poolId), "poolId cannot be a list");

  React.useEffect(() => {
    if (roundId == "current") {
      router.push(`/apr/round/${LAST_ROUND_ID}`);
    }

    if (!roundId) {
      router.push(`round/${LAST_ROUND_ID}`);
    }
  }, [roundId]);

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
              `/apr/pool/${value.network}/${value.poolId}/round/${roundId}`,
            );
            setValue("poolId", value.poolId);
          }}
        >
          <div className="relative">
            <div className="space-x-2">
              <label className="mb-2 text-sm text-slate12">Round</label>
              <label
                className={clsx("px-1 float-right text-sm rounded-full", {
                  "text-slate12 bg-blue-600 hover:bg-blue-700":
                    roundId === LAST_ROUND_ID,
                  "text-slate12 bg-gray-600 hover:bg-gray-700":
                    roundId !== LAST_ROUND_ID,
                })}
              >
                {roundId === LAST_ROUND_ID ? "Current" : "Ended"}
              </label>
            </div>

            <Select
              value={roundId ?? ""}
              onValueChange={(value) => {
                router.push(!poolId ? `/apr/round/${value}` : `${value}`);
              }}
              className="w-full"
            >
              {ALL_ROUNDS.map((round) => (
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
