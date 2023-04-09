"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useContext } from "react";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import { Tooltip } from "#/components/Tooltip";
import { NetworksContext } from "#/contexts/networks";

import { useAccount } from "wagmi";
import { PoolMetadataItemForm } from "./PoolMetadataForm";
import { TransactionModal } from "./TransactionModal";

export function Actions({
  poolId,
  isOwner,
  metadataUpdated,
}: {
  poolId: `0x${string}`;
  isOwner: boolean;
  metadataUpdated: boolean;
}) {
  const { mismatchedNetworks } = useContext(NetworksContext);
  const account = useAccount();

  if (mismatchedNetworks || !account.isConnected)
    return (
      <div className="mt-2 flex justify-end">
        <Tooltip content="You'll be able to edit the metadata if the connected wallet is the pool owner and it's on the same network the pool is deployed to.">
          <InfoCircledIcon />
        </Tooltip>
      </div>
    );

  return (
    <div className="mt-5 w-full justify-between sm:flex sm:items-center">
      <div className="flex gap-4">
        <Tooltip
          content={"You are not the pool owner"}
          disableTooltip={isOwner}
        >
          <span tabIndex={0}>
            <Dialog title={"Add attribute"} content={<PoolMetadataItemForm />}>
              <Button
                className="bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-indigo-400"
                disabled={!isOwner}
              >
                Add attribute
              </Button>
            </Dialog>
          </span>
        </Tooltip>

        <Button className="border border-blue-500 bg-gray-900  text-blue-500 hover:bg-gray-800 focus-visible:outline-indigo-500">
          Import template
        </Button>
      </div>
      <Tooltip
        content={
          !isOwner
            ? "You are not the pool owner"
            : "Your need to update the metadata first"
        }
        disableTooltip={isOwner && metadataUpdated}
      >
        <span tabIndex={0}>
          <Dialog
            title={"Update metadata"}
            content={<TransactionModal poolId={poolId} />}
          >
            <Button
              className="bg-amber-400 text-gray-900 hover:bg-amber-300 focus-visible:bg-amber-300 disabled:opacity-40"
              disabled={!metadataUpdated || !isOwner}
            >
              Update metadata
            </Button>
          </Dialog>
        </span>
      </Tooltip>
    </div>
  );
}
