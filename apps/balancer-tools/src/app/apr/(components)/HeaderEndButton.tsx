"use client";

import {
  capitalize,
  networkFor,
  networkIdFor,
  networksOnBalancer,
} from "@bleu-balancer-tools/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { Badge } from "#/components/Badge";
import { Dialog } from "#/components/Dialog";
import { SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";

import { Round } from "../(utils)/rounds";

const ALL_ROUNDS = Round.getAllRounds();
const LAST_ROUND_ID = ALL_ROUNDS[0].value;

export default function HeaderEndButton() {
  const { poolId, roundId, network } = useParams();

  const router = useRouter();
  const [selectedRound, setSelectedRound] = React.useState(roundId as string);

  React.useEffect(() => {
    if (!poolId && (!roundId || roundId === "current")) {
      router.push(`/apr/round/${LAST_ROUND_ID}`);
      setSelectedRound(LAST_ROUND_ID);
    } else if (typeof roundId === "undefined") {
      setSelectedRound("");
    }
  }, [roundId]);

  const handlePoolClick = ({
    network,
    poolId,
  }: {
    network: string;
    poolId: string;
  }) => {
    router.push(`/apr/pool/${networkFor(network)}/${poolId}`);
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
            possibleNetworks={avaliableNetworks}
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
      <Select
        placeholder="Select a round"
        value={selectedRound}
        onValueChange={(value) => {
          setSelectedRound(value);
          router.push(
            !poolId
              ? `/apr/round/${value}`
              : `/apr/pool/${network}/${poolId}/round/${value}`,
          );
        }}
      >
        {typeof roundId === "undefined" ? (
          <SelectItem value="">Select a round</SelectItem>
        ) : (
          ""
        )}
        <div className="flex flex-col gap-y-1">
          {ALL_ROUNDS.map((round) => (
            <SelectItem key={round.value} value={round.value}>
              <div className="flex gap-x-2 items-center">
                <Badge color="darkBlue" size="sm">
                  <div className="flex items-center gap-x-1">
                    <span className="hidden sm:block">Round</span>
                    {round.value}
                  </div>
                </Badge>
                <span>{round.label}</span>
              </div>
            </SelectItem>
          ))}
        </div>
      </Select>
    </div>
  );
}
