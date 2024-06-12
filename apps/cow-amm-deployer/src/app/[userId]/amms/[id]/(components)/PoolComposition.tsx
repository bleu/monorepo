"use client";

import { Card } from "@bleu/ui";

import { ICowAmm } from "#/lib/fetchAmmData";

import { PoolCompositionTable } from "./PoolCompositionTable";

export function PoolComposition({ ammData }: { ammData: ICowAmm }) {
  return (
    <Card.Root className="bg-foreground text-background overflow-visible max-w-full rounded-none px-3">
      <Card.Header className="py-1 px-0">
        <Card.Title className="px-0 text-xl">Pool composition</Card.Title>
        <Card.Description className="px-0 text-base">
          Check your current CoW AMM pool composition
        </Card.Description>
      </Card.Header>
      <Card.Content className="px-0">
        <PoolCompositionTable ammData={ammData} />
      </Card.Content>
    </Card.Root>
  );
}
