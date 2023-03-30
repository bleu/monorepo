"use client";

import { Network } from "@balancer-pool-metadata/balancer-gql/codegen";
import {
  ArrowTopRightIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import cn from "classnames";
import { TableHTMLAttributes, useContext, useEffect } from "react";
import useSWR from "swr";
import { useAccount, useNetwork } from "wagmi";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import { Tooltip } from "#/components/Tooltip";
import {
  PoolMetadataAttribute,
  PoolMetadataContext,
} from "#/contexts/PoolMetadataContext";
import balancerGql, { networkIdFor } from "#/lib/gql";
import metadataGql from "#/lib/poolMetadataGql";
import { isPoolOwner } from "#/utils/address";
import { fetcher } from "#/utils/fetcher";
import { toSlug } from "#/utils/formatStringCase";
import { truncateAddress } from "#/utils/truncateAddress";

import { PoolMetadataItemForm } from "./PoolMetadataForm";
import { TransactionModal } from "./TransactionModal";

type CellProps = TableHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className, children }: CellProps) => (
  <th
    scope="col"
    className={cn(
      "py-3.5 px-3 text-left text-sm font-semibold text-white",
      className
    )}
  >
    {children}
  </th>
);

const Header = () => {
  const cols = [
    {
      node: <span className="sr-only">Edit</span>,
      className: "relative py-3.5 pl-3 pr-4 sm:pr-0",
    },
    { node: "Name" },
    { node: "Typename" },
    { node: "Description" },
    { node: "Value" },
  ];

  return (
    <thead>
      <tr>
        {cols.map(({ node, className }, index) => (
          <Th key={index} className={className}>
            {node}
          </Th>
        ))}
      </tr>
    </thead>
  );
};

const Td = ({ className, children }: CellProps) => {
  return (
    <td className={cn("whitespace py-4 px-3 text-sm text-gray-300", className)}>
      {children}
    </td>
  );
};

const AttributeLink = ({ data }: { data: PoolMetadataAttribute }) => {
  switch (data.typename) {
    case "url":
      return (
        <button>
          <ArrowTopRightIcon className="text-white" />
        </button>
      );
    // TODO: decide whether we want to have an image type and create it accordingly
    // case "image":
    //   return (
    //     <button>
    //       <ImageDialog src={data.value as string} />
    //     </button>
    //   );
    default:
      return <></>;
  }
};

function Row({
  data,
  mode = "view",
}: {
  data: PoolMetadataAttribute;
  mode: "view" | "edit";
}) {
  const { handleRemoveMetadataAttr } = useContext(PoolMetadataContext);

  return (
    <tr>
      <Td>
        {mode === "edit" && (
          <div className="flex justify-around">
            <button
              className="flex items-center"
              onClick={() => handleRemoveMetadataAttr(data.key)}
            >
              <TrashIcon className="text-red-400" width={16} height={16} />
            </button>
            <Dialog
              title={"Edit attribute"}
              content={<PoolMetadataItemForm data={data} mode="edit" />}
            >
              <button className="flex items-center">
                <Pencil2Icon className="text-yellow-400" />
              </button>
            </Dialog>
          </div>
        )}
      </Td>
      <Td className="min-w-[10rem]">{data.key}</Td>
      <Td>{data.typename}</Td>
      <Td>{data.description}</Td>
      <Td>
        <div className="flex justify-between gap-2">
          <>{data.value}</>
          <AttributeLink data={data} />
        </div>
      </Td>
    </tr>
  );
}

export function MetadataAttributesTable({
  poolId,
  network,
}: {
  poolId: `0x${string}`;
  network: Network;
}) {
  const {
    metadata,
    handleSetMetadata,
    handleSetOriginalMetadata,
    metadataUpdated,
  } = useContext(PoolMetadataContext);

  const { chain } = useNetwork();
  const { address } = useAccount();

  const chainId = chain?.id.toString() || networkIdFor(network);
  const { data: poolOwner } = balancerGql(chainId).usePoolOwner({
    poolId,
  });
  const { data: poolsData } = metadataGql(chainId).useMetadataPool({
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
    handleSetOriginalMetadata(data ? (data as PoolMetadataAttribute[]) : []);
  }, [data]);

  const balancerPoolLink = `https://app.balancer.fi/#/${network}/pool/${poolId}`;
  const isOwner = isPoolOwner(chainId, poolOwner?.pool?.owner, address);

  return (
    <div className="w-full bg-gray-900">
      <div className="pr-4 sm:pr-6 lg:pr-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="mx-1 flex text-2xl font-medium text-gray-400">
              Metadata attributes - Pool
              <a
                target="_blank"
                href={balancerPoolLink}
                className="flex flex-row items-center justify-center"
              >
                #{truncateAddress(poolId)}{" "}
                <ArrowTopRightIcon width={25} height={25} fontWeight={25} />
              </a>
            </h1>
          </div>
        </div>

        <div className="mt-4 flow-root rounded-md border border-gray-700 bg-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            <Header />

            <tbody className="divide-y divide-gray-800">
              {metadata.map((item) => (
                <Row
                  key={toSlug(item.key)}
                  data={item}
                  mode={isOwner ? "edit" : "view"}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 w-full justify-between sm:flex sm:items-center">
          <div className="flex gap-4">
            <Tooltip content={"You are not the pool owner"} open={!isOwner}>
              <span tabIndex={0}>
                <Dialog
                  title={"Add attribute"}
                  content={<PoolMetadataItemForm />}
                >
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
            open={!metadataUpdated || !isOwner}
          >
            <span tabIndex={0}>
              <Dialog
                title={"Update metadata"}
                content={<TransactionModal poolId={poolId} />}
              >
                <Button
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 focus-visible:bg-yellow-300 disabled:bg-yellow-200"
                  disabled={!metadataUpdated || !isOwner}
                >
                  Update metadata
                </Button>
              </Dialog>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
