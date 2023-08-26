"use client";

import { networkIdFor } from "@bleu-balancer-tools/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Dialog } from "#/components/Dialog";
import { SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";

import { Round } from "../(utils)/rounds";

const ALL_ROUNDS = Round.getAllRounds();
const LAST_ROUND_ID = ALL_ROUNDS[0].value;

export default function HeaderEndButton({
  roundId,
  poolId,
  network,
}: {
  roundId?: string | undefined;
  poolId?: string | undefined;
  network?: string | undefined;
}) {
  const router = useRouter();
  const [selectedRound, setSelectedRound] = React.useState(roundId);

  React.useEffect(() => {
    if (!poolId && (!roundId || roundId === "current")) {
      router.push(`/apr/round/${LAST_ROUND_ID}`);
      setSelectedRound(LAST_ROUND_ID);
    } else {
      setSelectedRound(undefined);
    }
    setSelectedRound(roundId);
  }, [roundId]);

  const handlePoolClick = ({
    network,
    poolId,
  }: {
    network: string;
    poolId: string;
  }) => {
    router.push(`/apr/pool/${network}/${poolId}`);
  };

  return (
    <div className="flex gap-6">
      <Dialog
        title="Import pool parameters"
        content={
          <SearchPoolForm
            defaultValueNetwork={networkIdFor(network)}
            onSubmit={handlePoolClick}
          />
        }
      >
        <div className="flex items-center space-x-2 text-sm font-normal text-slate12 bg-blue3 border border-blue6 p-2 rounded-[4px] cursor-pointer">
          <MagnifyingGlassIcon width="20" height="20" strokeWidth={1} />
          <span className="font-medium">Search for specific pool</span>
        </div>
      </Dialog>
      <Select
        placeholder="Select a round"
        value={selectedRound}
        onValueChange={(value) => {
          router.push(
            !poolId
              ? `/apr/round/${value}`
              : `/apr/pool/${network}/${poolId}/round/${value}`,
          );
        }}
        className=""
      >
        {ALL_ROUNDS.map((round) => (
          <SelectItem key={round.value} value={round.value}>
            {round.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
