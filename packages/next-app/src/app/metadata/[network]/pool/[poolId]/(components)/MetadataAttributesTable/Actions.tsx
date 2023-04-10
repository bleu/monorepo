"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { useAccount } from "wagmi";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import { Tooltip } from "#/components/Tooltip";
import { NetworksContext } from "#/contexts/networks";

import { PoolMetadataItemForm } from "./PoolMetadataForm";
import { PredefinedMetadataModal } from "./PredefinedMetadataModal";
import { TransactionModal } from "./TransactionModal";

export function Actions({
  poolId,
  isOwner,
  metadataUpdated,
  isMetadataValid,
}: {
  poolId: `0x${string}`;
  isOwner: boolean;
  metadataUpdated: boolean;
  isMetadataValid: boolean;
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
        <Tooltip content="You are not the pool owner" disableTooltip={isOwner}>
          <span tabIndex={0}>
            <Dialog title="Add attribute" content={<PoolMetadataItemForm />}>
              <Button shade="light" disabled={!isOwner}>
                Add attribute
              </Button>
            </Dialog>
          </span>
        </Tooltip>

        <Tooltip content="You are not the pool owner" disableTooltip={isOwner}>
          <span tabIndex={0}>
            <Dialog
              title="Add predefined attributes"
              content={<PredefinedMetadataModal />}
            >
              <Button shade="light" variant="outline" disabled={!isOwner}>
                Add predefined attributes
              </Button>
            </Dialog>
          </span>
        </Tooltip>
      </div>

      <Tooltip
        content={
          !isOwner
            ? "You are not the pool owner"
            : "You need to make changes to the metadata first"
        }
        disableTooltip={isOwner && metadataUpdated && isMetadataValid}
      >
        <span tabIndex={0}>
          <Dialog
            title="Update metadata"
            content={<TransactionModal poolId={poolId} />}
          >
            <Button
              color="cyan"
              disabled={!metadataUpdated || !isOwner || !isMetadataValid}
            >
              Update metadata
            </Button>
          </Dialog>
        </span>
      </Tooltip>
    </div>
  );
}
