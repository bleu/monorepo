"use client";

import { VeBalGetVotingListQuery } from "@bleu/gql/src/balancer-api-v3/__generated__/Ethereum";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import {
  gaugeItem,
  useGaugesCheckpointer,
} from "#/contexts/GaugesCheckpointerContext";
import { balancerApiV3 } from "#/lib/gql";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";
import { useAccount } from "#/wagmi";
import { readBalToMint } from "#/wagmi/readBalToMint";

import { ConfirmCheckpointsDialog } from "../(components)/ConfirmCheckpointsDialog";
import { GaugesTable } from "../(components)/GaugesTable";

export default function page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  const { data: veBalGetVotingList } = balancerApiV3
    .gql("1")
    .useVeBalGetVotingList();

  const { selectedGauges, clearNotification, setSelectedGauges } =
    useGaugesCheckpointer();

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  function votingListFilter(
    votingOption: ArrElement<
      GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
    >
  ) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return (
      !votingOption.gauge.isKilled &&
      currentTimestamp > (votingOption.gauge.addedTimestamp || 0) &&
      votingOption.chain !== "MAINNET"
    );
  }
  const [gaugeItems, setGaugeItems] = useState<gaugeItem[]>([]);

  async function updateGaugeItems(
    votingOptions: GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
  ) {
    setLoading(true);

    const votingOptionsFiltered = votingOptions.filter(votingListFilter);
    const balToMinOnEachGauge = await Promise.all(
      votingOptionsFiltered?.map(async (votingOption) => {
        return readBalToMint(votingOption);
      })
    );
    const newGaugeItems = votingOptionsFiltered.map((votingOption, index) => {
      return {
        votingOption,
        balToMint: balToMinOnEachGauge[index],
      };
    });
    setGaugeItems(newGaugeItems);
    setLoading(false);
    setSelectedGauges([]);
  }
  useEffect(() => {
    if (!veBalGetVotingList) return;
    updateGaugeItems(veBalGetVotingList?.veBalGetVotingList);
  }, [veBalGetVotingList]);

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="mt-20 flex w-4/6 flex-col gap-y-5">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col text-slate12">
            <h1 className="text-3xl">Active L2 Gauges</h1>
            <span>
              Here is a list of all active gauges on second layers and how much
              each of them can be mint.
            </span>
          </div>
          <div className="flex gap-4">
            <Dialog
              title={`Confirm gauges checkpoint`}
              content={
                <ConfirmCheckpointsDialog
                  setIsOpenDialog={setIsOpenDialog}
                  reloadTable={() => {
                    if (veBalGetVotingList)
                      updateGaugeItems(veBalGetVotingList?.veBalGetVotingList);
                  }}
                />
              }
              isOpen={isOpenDialog}
              setIsOpen={setIsOpenDialog}
            >
              <Button
                className="flex items-center gap-1 p-2"
                title="Checkpoint gauges"
                disabled={selectedGauges.length === 0}
                onClick={clearNotification}
              >
                <PlusIcon />
                Checkpoint
              </Button>
            </Dialog>
          </div>
        </div>
        <GaugesTable gaugeItems={gaugeItems} loading={loading} />
      </div>
    </div>
  );
}
