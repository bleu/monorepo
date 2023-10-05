"use client";

import {
  capitalize,
  networkFor,
  networkIdFor,
  networksOnBalancer,
} from "@bleu-balancer-tools/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import * as React from "react";

import { Dialog } from "#/components/Dialog";
import { SearchPoolForm } from "#/components/SearchPoolForm";
import { DateRangePicker } from "#/components/ui/date-range-picker";

import { formatDateToMMDDYYYY } from "../api/(utils)/date";

export default function HeaderEndButton() {
  const { network } = useParams();
  const searchParams = useSearchParams();
  const startAtParam = searchParams.get("startAt");
  const endAtParam = searchParams.get("endAt");
  const pathname = usePathname();
  const router = useRouter();

  const handleDateUpdate = (from: string, to: string) => {
    const newQuery = {
      startAt: from,
      endAt: to,
    };

    const queryString = Object.entries(newQuery)
      .map(([key, value]) => `&${key}=${value}`)
      .join("");
    router.push(pathname + "?" + queryString, { scroll: false });
  };

  const handlePoolClick = ({
    network,
    poolId,
  }: {
    network: string;
    poolId: string;
  }) => {
    router.push(
      `/apr/pool/${networkFor(
        network,
      )}/${poolId}?startAt=${startAtParam}&endAt=${endAtParam}`,
    );
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
            gqlAdditionalVariable={{ totalLiquidity_gt: 5000 }}
          />
        }
      >
        <div className="flex items-center gap-x-2 text-sm font-normal text-slate12 bg-blue4 border border-blue6 px-2 rounded-[4px] cursor-pointer h-[35px]">
          <MagnifyingGlassIcon width="20" height="20" strokeWidth={1} />
          <span className="font-medium pr-1 w-max">Go to pool</span>
        </div>
      </Dialog>
      <DateRangePicker
        onUpdate={(values) => {
          const {
            range: { from, to },
          } = values;
          handleDateUpdate(
            formatDateToMMDDYYYY(from),
            formatDateToMMDDYYYY(to as Date),
          );
        }}
        initialDateFrom={startAtParam ?? undefined}
        initialDateTo={endAtParam ?? undefined}
      />
    </div>
  );
}
