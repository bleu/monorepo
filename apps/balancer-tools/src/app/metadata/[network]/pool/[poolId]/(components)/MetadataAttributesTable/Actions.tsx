"use client";

import { Address } from "@bleu-balancer-tools/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { useAccount } from "wagmi";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import { Tooltip } from "#/components/Tooltip";
import { NetworksContext } from "#/contexts/networks";

import PoolMetadataForm from "./PoolMetadataForm";
import { PredefinedMetadataModal } from "./PredefinedMetadataModal";
import { TransactionModal } from "./TransactionModal";

const DISABLED_REASONS = {
  NOT_ALLOWED: "You are not allowed to update this pool's metadata",
  NOT_VALID: "You need to make changes to the metadata first",
} as const;

export function Actions({
  poolId,
  canEditMetadata,
  metadataUpdated,
  isMetadataValid,
}: {
  poolId: Address;
  canEditMetadata: boolean;
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
    <div className="mt-5 w-full flex-col justify-between gap-1 sm:flex sm:flex-row sm:items-center sm:gap-4">
      <div className="flex w-full justify-between gap-x-4 sm:w-fit">
        <Tooltip
          content={DISABLED_REASONS.NOT_ALLOWED}
          disableTooltip={canEditMetadata}
        >
          <span tabIndex={0} className="w-full sm:w-fit">
            <Dialog title="Add attribute" content={<PoolMetadataForm />}>
              <Button shade="light" className="w-full">
                Add attribute
              </Button>
            </Dialog>
          </span>
        </Tooltip>

        <Tooltip
          content={DISABLED_REASONS.NOT_ALLOWED}
          disableTooltip={canEditMetadata}
        >
          <span tabIndex={0} className="w-full sm:w-fit">
            <Dialog
              title="Add predefined attributes"
              content={<PredefinedMetadataModal />}
            >
              <Button shade="light" variant="outline" className="w-full">
                Add predefined attributes
              </Button>
            </Dialog>
          </span>
        </Tooltip>
      </div>

      <Tooltip
        content={
          !canEditMetadata
            ? DISABLED_REASONS.NOT_ALLOWED
            : DISABLED_REASONS.NOT_VALID
        }
        disableTooltip={canEditMetadata && metadataUpdated && isMetadataValid}
      >
        <span tabIndex={0} className="w-full sm:w-fit">
          <Dialog
            title="Update metadata"
            content={<TransactionModal poolId={poolId} />}
          >
            <Button
              color="cyan"
              disabled={
                !metadataUpdated || !canEditMetadata || !isMetadataValid
              }
              className="mt-4 w-full sm:mt-0"
            >
              Update metadata
            </Button>
          </Dialog>
        </span>
      </Tooltip>
    </div>
  );
}
