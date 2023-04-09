"use client";

import { Network, networkIdFor } from "@balancer-pool-metadata/shared";
import {
  ArrowTopRightIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import cn from "classnames";
import { TableHTMLAttributes, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import { ClickToCopy } from "#/components/ClickToCopy";
import { Dialog } from "#/components/Dialog";
import {
  PoolMetadataAttribute,
  usePoolMetadata,
} from "#/contexts/PoolMetadataContext";
import { isPoolOwner } from "#/utils/address";
import { toSlug } from "#/utils/formatStringCase";
import { truncate } from "#/utils/truncate";

import { Actions } from "./Actions";
import { PoolMetadataItemForm } from "./PoolMetadataForm";

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
    <td className={cn("whitespace py-4 px-3 text-sm text-slate12", className)}>
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
  const { handleRemoveMetadataAttr } = usePoolMetadata();

  return (
    <tr>
      <Td>
        {mode === "edit" && (
          <div className="flex justify-around">
            <button
              className="flex items-center"
              onClick={() => handleRemoveMetadataAttr(data.key)}
            >
              <TrashIcon
                className="text-tomato9 hover:text-tomato10"
                width={16}
                height={16}
              />
            </button>
            <Dialog
              title={"Edit attribute"}
              content={<PoolMetadataItemForm data={data} mode="edit" />}
            >
              <button className="flex items-center">
                <Pencil2Icon className="hover:text-amber100 text-amber10" />
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

export default function MetadataAttributesTable({
  poolId,
  network,
  poolOwner,
  cid,
  data,
  error,
}: {
  poolId: `0x${string}`;
  poolOwner: `0x${string}`;
  network: Network;
  cid?: string | null;
  data?: PoolMetadataAttribute[];
  error?: string | null;
}) {
  const {
    metadata,
    handleSetMetadata,
    handleSetOriginalMetadata,
    metadataUpdated,
  } = usePoolMetadata();

  const { chain } = useNetwork();
  const { address } = useAccount();

  const chainId = networkIdFor(network) ?? chain?.id.toString();

  useEffect(() => {
    handleSetMetadata(data ? (data as PoolMetadataAttribute[]) : []);
    handleSetOriginalMetadata(data ? (data as PoolMetadataAttribute[]) : []);
  }, [data]);

  const balancerPoolLink = `https://app.balancer.fi/#/${network}/pool/${poolId}`;
  const isOwner = isPoolOwner(chainId, poolOwner, address);

  return (
    <div className="w-full bg-blue1">
      <div className="pr-4 sm:pr-6 lg:pr-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="flex text-2xl">Pool attributes</h1>
            <div className="inline-block">
              <a
                target="_blank"
                href={balancerPoolLink}
                className="flex flex-row items-center text-slate11"
              >
                Open on app.balancer.fi
                <ArrowTopRightIcon
                  width={16}
                  height={16}
                  fontWeight={16}
                  className="ml-1"
                />
              </a>
            </div>

            <table>
              <tr>
                <td>Pool ID:</td>
                <td>
                  <ClickToCopy text={poolId}>{truncate(poolId)}</ClickToCopy>
                </td>
              </tr>
              <tr>
                <td>Metadata CID:</td>
                <td>
                  {cid ? (
                    <ClickToCopy text={cid}>{truncate(cid)}</ClickToCopy>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            </table>
          </div>
        </div>
        {error ?? (
          <div>
            <div className="mt-4 flow-root max-h-[30rem] overflow-y-scroll rounded-md border border-blue6 bg-blue3">
              <table className="min-w-full divide-y divide-blue6">
                <Header />

                <tbody className="divide-y divide-blue6">
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
            <Actions
              poolId={poolId}
              isOwner={isOwner}
              metadataUpdated={metadataUpdated}
            />
          </div>
        )}{" "}
      </div>
    </div>
  );
}
