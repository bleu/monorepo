"use client";

import clsx from "clsx";
import { useParams, usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";

import { Header } from "#/components/Header";
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";

const FIRST_ROUND_END_DATE = new Date("2022-04-13T23:59:59.999Z");
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const ROUNDS_COUNT =
  Math.ceil((Date.now() - FIRST_ROUND_END_DATE.getTime()) / ONE_WEEK_IN_MS) + 1;

const ROUNDS = Array.from({ length: ROUNDS_COUNT }, (_, i) => ({
  label: `${new Date(
    FIRST_ROUND_END_DATE.getTime() + i * ONE_WEEK_IN_MS,
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`,
  value: String(i + 1),
  activeRound: i === ROUNDS_COUNT - 1,
})).reverse();

export default function Layout({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const { roundId, poolId } = useParams();
  const form = useForm<PoolAttribute>();
  const { setValue } = form;

  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(poolId), "poolId cannot be a list");

  React.useEffect(() => {
    if (roundId == "current") {
      router.push(`/apr/round/${ROUNDS[0].value}`);
    }

    if (!roundId) {
      router.push(`${pathname}/round/${ROUNDS[0].value}`);
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
      <div className="flex flex-1 gap-x-8">
        <div className="h-full w-72 lg:w-80 max-w-sm">
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
                      roundId === ROUNDS[0].value,
                    "text-slate12 bg-gray-600 hover:bg-gray-700":
                      roundId !== ROUNDS[0].value,
                  })}
                >
                  {roundId === ROUNDS[0].value ? "Current" : "Ended"}
                </label>
              </div>

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
        </div>
        <div className="h-full flex-1 py-5 pr-8 text-white">{children}</div>
      </div>
    </div>
  );
}
