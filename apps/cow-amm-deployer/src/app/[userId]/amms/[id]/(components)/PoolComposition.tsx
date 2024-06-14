"use client";

import { Card } from "@bleu/ui";
import { formatNumber } from "@bleu/utils/formatNumber";

import { useAmmData } from "#/contexts/ammData";

import { PoolCompositionTable } from "./PoolCompositionTable";

export function PoolComposition() {
  const { ammData } = useAmmData();
  return (
    <Card.Root className="bg-foreground text-background overflow-visible max-w-full rounded-none px-3">
      <Card.Header className="py-1 px-0">
        <Card.Title className="px-0 text-xl">Pool composition</Card.Title>
        <Card.Description className="px-0 text-base">
          The current pool TVL is{" "}
          <span className="font-semibold">
            ${formatNumber(ammData.totalUsdValue, 2)}
          </span>
        </Card.Description>
      </Card.Header>
      <Card.Content className="px-0">
        <PoolCompositionTable ammData={ammData} />
      </Card.Content>
    </Card.Root>
  );
}
