"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bleu/ui";
import { formatNumber } from "@bleu/utils/formatNumber";

import { useAmmData } from "#/contexts/ammDataContext";

import { PoolCompositionTable } from "./PoolCompositionTable";

export function PoolComposition() {
  const { ammData } = useAmmData();
  return (
    <Card className="bg-foreground text-background overflow-visible max-w-full rounded-none px-3">
      <CardHeader className="py-1 px-0">
        <CardTitle className="px-0 text-xl">Pool composition</CardTitle>
        <CardDescription className="px-0 text-base">
          The current pool TVL is{" "}
          <span className="font-semibold">
            ${formatNumber(ammData.totalUsdValue, 2)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <PoolCompositionTable ammData={ammData} />
      </CardContent>
    </Card>
  );
}
