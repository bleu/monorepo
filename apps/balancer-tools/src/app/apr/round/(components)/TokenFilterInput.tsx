"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";

import { MultiSelectDropdown } from "../../(components)/MultiSelectDropdown";


const AVALIABLE_TOKENS = [
  ...new Set(
    POOLS_WITH_LIVE_GAUGES.flatMap((pool) =>
      pool.tokens.map((token) => token.symbol),
    ),
  ),
];

export function TokenFilterInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTokenSelect = (selectedItems: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!selectedItems.length) {
      current.delete("tokens");
    } else {
      current.set("tokens", selectedItems.join(","));
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(window.location.pathname + query, { scroll: false });
  };

  return (
    <>
      <MultiSelectDropdown
        items={AVALIABLE_TOKENS}
        placeholderText="Filter by token"
        initialSelectedItems={
          searchParams.get("tokens") !== null
            ? (searchParams.get("tokens")?.split(",") as string[])
            : []
        }
        onSelectionItemsChange={handleTokenSelect}
      />
    </>
  );
}
