"use client";

import {
  capitalize,
  networkFor,
  networkIdFor,
  networksOnBalancer,
} from "@bleu-balancer-tools/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useState } from "react";

import { Dialog } from "#/components/Dialog";
import { BaseInput } from "#/components/Input";
import { SearchPoolForm } from "#/components/SearchPoolForm";

import { formatDateToMMDDYYYY } from "../api/route";

export default function HeaderEndButton() {
  const { poolId, network } = useParams();
  const searchParams = useSearchParams();
  const startAtParam = searchParams.get("startAt")
  const endAtParam = searchParams.get("endAt")

  const router = useRouter();
  const [startAtInput, setStartAtInput] = useState("")
  const [endAtInput, setEndAtInput] = useState("")

  React.useEffect(() => {
    if (!poolId) {
      if ((!startAtInput && !endAtInput) && (startAtParam && endAtParam)){
        setStartAtInput(startAtParam)
        setEndAtInput(endAtParam)
        router.push(`/apr/?startAt=${startAtParam}&endAt=${endAtParam}&`);
      } else if ((!startAtInput && !endAtInput) && (!startAtParam && !endAtParam)){
        const currentDateFormated = formatDateToMMDDYYYY(new Date())
        const OneWeekAgoDateFormated = formatDateToMMDDYYYY(new Date((new Date).getTime() - 7 * 24 * 60 * 60 * 1000))
        setStartAtInput(currentDateFormated)
        setEndAtInput(OneWeekAgoDateFormated)
        router.push(`/apr/?startAt=${currentDateFormated}&endAt=${OneWeekAgoDateFormated}&`);
      }
    }
  }, [searchParams]);

  const handlePoolClick = ({
    network,
    poolId,
  }: {
    network: string;
    poolId: string;
  }) => {
    router.push(`/apr/pool/${networkFor(network)}/${poolId}?startAt=${startAtParam}&endAt=${endAtParam}`);
  };
  const avaliableNetworks = Object.keys(networksOnBalancer).map((key) => ({
    value: key,
    label: capitalize(networksOnBalancer[key]),
  }));
  return (
    <div className="flex gap-6">
      <Dialog
        title="Go to pool"
        content={
          <SearchPoolForm
            availableNetworks={avaliableNetworks}
            defaultValueNetwork={networkIdFor(network as string)}
            onSubmit={handlePoolClick}
            showPools
            onlyVotingGauges
          />
        }
      >
        <div className="flex items-center gap-x-2 text-sm font-normal text-slate12 bg-blue4 border border-blue6 px-2 rounded-[4px] cursor-pointer h-[35px]">
          <MagnifyingGlassIcon width="20" height="20" strokeWidth={1} />
          <span className="font-medium pr-1">Go to pool</span>
        </div>
      </Dialog>
      <BaseInput value={endAtInput} onChange={(e) =>{ setEndAtInput(e.target.value); router.push(`/apr/?startAt=${startAtInput}&endAt=${e.target.value}&`); }} />
      <BaseInput value={startAtInput} onChange={(e) =>{ setStartAtInput(e.target.value); router.push(`/apr/?startAt=${e.target.value}&endAt=${endAtInput}&`); }} />
    </div>
  );
}
