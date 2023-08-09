import clsx from "clsx";
import * as React from "react";
import { useForm } from "react-hook-form";

import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";
import { useSelectedPoolRoundContext } from "#/contexts/SelectedPoolRound";

import { Round } from "../(utils)/rounds";

const ALL_ROUNDS = Round.getAllRounds();

export default function Sidebar() {
  const {
    selectedPool,
    selectedNetwork,
    selectedRound,
    setSelectedRound,
    setSelectedPool,
    setNetworkId,
  } = useSelectedPoolRoundContext();
  const form = useForm<PoolAttribute>();
  const { setValue } = form;
  React.useEffect(() => {
    if (selectedPool) {
      setValue("poolId", selectedPool);
    }
    if (selectedNetwork) {
      setValue("network", String(selectedNetwork));
    }
  }, [selectedPool, selectedNetwork]);

  return (
    <SearchPoolForm
      showPools
      form={form}
      defaultValuePool={selectedPool}
      onSubmit={(value) => {
        setSelectedPool(value.poolId);
      }}
      onChangeNetwork={(value) => {
        setNetworkId(value);
      }}
    >
      <div className="relative">
        <div className="space-x-2">
          <label className="mb-2 text-sm text-slate12">Round</label>
          <label
            className={clsx("px-1 float-right text-sm rounded-full", {
              "text-slate12 bg-blue-600 hover:bg-blue-700":
                selectedRound === ALL_ROUNDS[0].value,
              "text-slate12 bg-gray-600 hover:bg-gray-700":
                selectedRound !== ALL_ROUNDS[0].value,
            })}
          >
            {selectedRound === ALL_ROUNDS[0].value ? "Current" : "Ended"}
          </label>
        </div>

        <Select
          value={selectedRound ?? ""}
          onValueChange={(value) => {
            setSelectedRound(value);
          }}
          className="w-full"
        >
          {ALL_ROUNDS.map((round) => (
            <SelectItem key={round.value} value={round.value}>
              {round.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </SearchPoolForm>
  );
}
