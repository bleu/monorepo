"use client";
import * as Alert from "@radix-ui/react-alert-dialog";
import {
  BoxIcon,
  CheckboxIcon,
  ExclamationTriangleIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import cn from "classnames";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { useNetwork } from "wagmi";

import { Button } from "#/components";
import {
  PoolMetadataAttribute,
  PoolMetadataContext,
  StatusLabels,
  UpdateStatus,
} from "#/contexts/PoolMetadataContext";
import { pinJSON } from "#/lib/ipfs";
import metadataGql from "#/lib/poolMetadataGql";
import { fetcher } from "#/utils/fetcher";
import { writeSetPoolMetadata } from "#/wagmi/setPoolMetadata";

const ActionStage = ({
  description,
  stage,
  error,
}: {
  description: string;
  stage: number;
  error: number;
}) => {
  const { updateStatus } = useContext(PoolMetadataContext);

  const Icon =
    error === stage
      ? ExclamationTriangleIcon
      : updateStatus < stage
      ? BoxIcon
      : updateStatus === stage
      ? UpdateIcon
      : CheckboxIcon;

  return (
    <div className="flex items-center space-x-2 text-xl">
      <>
        <Icon
          className={`${
            stage === error
              ? "text-red-400"
              : stage >= updateStatus
              ? "text-white"
              : "text-blue-500"
          }`}
          width={32}
          height={32}
        />
        <div
          className={`font-light 
  
          ${
            stage === error
              ? "text-red-400"
              : stage > updateStatus
              ? "text-slate-400"
              : "text-white"
          }`}
        >
          {description}
        </div>
      </>
    </div>
  );
};

export function TransactionDialog({
  children,
  poolId,
}: React.PropsWithChildren<{
  poolId: `0x${string}`;
}>) {
  const [open, setOpen] = useState(false);
  const [stageError, setStageError] = useState(-1);
  const { chain } = useNetwork();

  const {
    metadata,
    handleSetMetadata,
    setStatus,
    updateStatus,
    submit,
    handleSubmit,
  } = useContext(PoolMetadataContext);

  const { data: poolsData } = metadataGql(
    chain?.id.toString() || "1"
  ).useMetadataPool({
    poolId,
  });

  const pool = poolsData?.pools[0];
  const { data } = useSWR(
    pool?.metadataCID
      ? `https://gateway.pinata.cloud/ipfs/${pool.metadataCID}`
      : null,
    fetcher,
    {
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    handleSetMetadata(data ? (data as PoolMetadataAttribute[]) : []);
  }, [data]);

  useEffect(() => {
    if (submit) {
      setStageError(-1);
      async function handleUpdatePoolMetadata() {
        setStatus(UpdateStatus.PINNING);

        const pinData = await pinJSON(poolId, metadata);
        setStatus(UpdateStatus.AUTHORIZING);

        try {
          const { wait } = await writeSetPoolMetadata(poolId, pinData.IpfsHash);
          setStatus(UpdateStatus.SUBMITTING);
          const receipt = await wait();
          if (receipt.status) {
            setStatus(UpdateStatus.CONFIRMED);
          } else {
            setStageError(2);
          }
        } catch (error) {
          setStageError(1);
        }
      }

      if (metadata) handleUpdatePoolMetadata();
      handleSubmit(false);
    }
  }, [submit]);

  return (
    <Alert.Root open={open} onOpenChange={setOpen}>
      <Alert.Trigger asChild>{children}</Alert.Trigger>
      <Alert.Portal>
        <Alert.Overlay
          className={cn(
            "bg-blackA10 data-[state=open]:animate-overlayShow fixed inset-0"
          )}
        />
        <Alert.Content
          className={cn(
            "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-700 p-12 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          )}
        >
          <Alert.Title asChild>
            <h1 className="mx-1 mb-6 text-3xl text-gray-400">
              Update metadata
            </h1>
          </Alert.Title>
          <div className="w-full space-y-6 p-4">
            <ActionStage
              description="Pinning file to IPFS"
              stage={0}
              error={stageError}
            />
            <ActionStage
              description="Waiting user to confirm transaction"
              stage={1}
              error={stageError}
            />
            <ActionStage
              description="Submitting transaction on-chain"
              stage={2}
              error={stageError}
            />
            <ActionStage
              description="Transaction confirmed"
              stage={3}
              error={stageError}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Alert.Action asChild>
              <>
                {stageError > -1 ? (
                  <Button
                    onClick={() => {
                      handleSubmit(true);
                    }}
                    form="attribute-form"
                    type="button"
                    disabled={stageError < 0}
                    className="bg-blue-500 p-8 text-gray-50 hover:bg-blue-400 focus-visible:outline-blue-500 disabled:bg-gray-600 disabled:text-gray-500"
                  >
                    Try again
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                    form="attribute-form"
                    type="button"
                    disabled={
                      stageError < 0 && updateStatus !== UpdateStatus.CONFIRMED
                    }
                    className="bg-blue-500 p-8 text-gray-50 hover:bg-blue-400 focus-visible:outline-blue-500 disabled:bg-gray-600 disabled:text-gray-500"
                  >
                    {StatusLabels[updateStatus]}
                  </Button>
                )}
              </>
            </Alert.Action>
          </div>
        </Alert.Content>
      </Alert.Portal>
    </Alert.Root>
  );
}
