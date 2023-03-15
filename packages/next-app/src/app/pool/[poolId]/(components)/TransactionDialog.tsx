"use client";
import * as Alert from "@radix-ui/react-alert-dialog";
import cn from "classnames";
import { useContext, useEffect, useState } from "react";
import {
  ImCheckboxChecked,
  ImCheckboxUnchecked,
  ImHourGlass,
} from "react-icons/im";
import useSWR from "swr";

import { Button } from "#/components";
import {
  PoolMetadataAttribute,
  PoolMetadataContext,
  UpdateStatus,
} from "#/contexts/PoolMetadataContext";
import { pinJSON } from "#/lib/ipfs";
import metadataGql from "#/lib/poolMetadataGql";
import { fetcher } from "#/utils/fetcher";
import { writeSetPoolMetadata } from "#/wagmi/setPoolMetadata";

const ActionStage = ({
  description,
  stage,
}: {
  description: string;
  stage: number;
}) => {
  const { updateStatus } = useContext(PoolMetadataContext);

  const Icon =
    updateStatus < stage
      ? ImCheckboxUnchecked
      : updateStatus === stage
      ? ImHourGlass
      : ImCheckboxChecked;

  return (
    <div className="flex items-center space-x-2 text-xl">
      <>
        <Icon className="text-white" />
        <div
          className={`font-light ${
            status === "idle" ? "text-slate-400" : "text-white"
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

  const { metadata, handleSetMetadata, setStatus, submit, handleSubmit } =
    useContext(PoolMetadataContext);

  const { data: poolsData } = metadataGql.useMetadataPool({
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
      async function handleUpdatePoolMetadata() {
        setStatus(UpdateStatus.PINNING);

        const pinData = await pinJSON(poolId, metadata);
        setStatus(UpdateStatus.AUTHORIZING);

        try {
          const { hash, wait } = await writeSetPoolMetadata(
            poolId,
            pinData.IpfsHash
          );
          console.log(hash, wait);
          setStatus(UpdateStatus.SUBMITTING);
          const receipt = await wait();
          if (receipt.status) {
            setStatus(UpdateStatus.CONFIRMED);
          } else {
            console.log("Error on transaction!", receipt);
          }
        } catch (error) {
          console.log(error);
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
            <ActionStage description="Pinning file to IPFS" stage={0} />
            <ActionStage
              description="Waiting user to confirm transaction"
              stage={1}
            />
            <ActionStage
              description="Submitting transaction on-chain"
              stage={2}
            />
            <ActionStage description="Transaction confirmed" stage={3} />
          </div>
          <div className="mt-4 flex justify-center">
            <Alert.Action asChild>
              <Button
                form="attribute-form"
                type="submit"
                disabled={false}
                className="bg-blue-500 p-8 text-gray-50 hover:bg-blue-400 focus-visible:outline-blue-500 disabled:bg-gray-600 disabled:text-gray-500"
              >
                Finish
              </Button>
            </Alert.Action>
          </div>
        </Alert.Content>
      </Alert.Portal>
    </Alert.Root>
  );
}
