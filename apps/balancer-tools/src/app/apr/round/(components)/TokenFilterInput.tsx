"use client";

import { useSearchParams } from "next/navigation";

import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";

import { MultiSelectDropdown } from "./MultiSelectDropdown";

const AVALIABLE_TOKENS = [
  ...new Set(
    POOLS_WITH_LIVE_GAUGES.flatMap((pool) =>
      pool.tokens.map((token) => token.symbol),
    ),
  ),
];

export function TokenFilterInput() {
  const searchParams = useSearchParams();

  const handleTokenSelect = (selectedItems: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    if (!selectedItems.length) {
      current.delete("tokens");
    } else {
      current.set("tokens", selectedItems.join("_"));
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Workaround while Next.js doesn't support shallow routing
    // https://github.com/vercel/next.js/discussions/48110
    window.history.pushState({}, "", window.location.pathname + query);
  };

  return (
    <>
      <MultiSelectDropdown
        items={AVALIABLE_TOKENS}
        labelText="Filter by token"
        initialSelectedItems={
          searchParams.get("tokens") !== null
            ? (searchParams.get("tokens")?.split("_") as string[])
            : []
        }
        onSelectionItemsChange={handleTokenSelect}
      />
    </>
  );
}
