"use client";
import { formatNumber } from "@bleu-fi/utils/formatNumber";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import {
  gaugeItem,
  useGaugesCheckpointer,
} from "#/contexts/GaugesCheckpointerContext";
import { getNetwork } from "#/contexts/networks";

export function GaugesTable() {
  const { notification, setIsNotifierOpen, isNotifierOpen, transactionUrl } =
    useGaugesCheckpointer();
  const gaugeList = [
    {
      address: "0x0000000000000000000000000000000000000000",
      chain: "ethereum",
      poolAddress: "0x0000",
      poolSymbol: "ETH",
      poolName: "ETH",
      balToMint: 0,
    },
  ] as gaugeItem[];

  return (
    <div className="flex h-full w-full flex-1 justify-center text-white">
      {gaugeList?.length === 0 && (
        <div className="mt-24 flex flex-col items-center justify-center">
          <div className="text-2xl font-semibold">
            No gauges found. Please try again latter
          </div>
        </div>
      )}
      {gaugeList?.length > 0 && (
        <Table shade={"darkWithBorder"}>
          <Table.HeaderRow>
            <Table.HeaderCell>Chain</Table.HeaderCell>
            <Table.HeaderCell>Pool</Table.HeaderCell>
            <Table.HeaderCell>Gauge</Table.HeaderCell>
            <Table.HeaderCell>BAL to mint</Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {gaugeList.map((gauge) => (
              <TableRow key={gauge.address} gauge={gauge} />
            ))}
          </Table.Body>
        </Table>
      )}
      {notification && (
        <Toast
          content={
            <ToastContent
              title={notification.title}
              description={notification.description}
              link={transactionUrl}
            />
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          variant={notification.variant}
        />
      )}
    </div>
  );
}

function TableRow({ gauge }: { gauge: gaugeItem }) {
  const network = getNetwork(gauge.chain);

  return (
    <Table.BodyRow key={gauge.address}>
      <Table.BodyCell>{network.toLocaleUpperCase()}</Table.BodyCell>
      <Table.BodyCell>{gauge.poolName}</Table.BodyCell>
      <Table.BodyCell>{gauge.address}</Table.BodyCell>
      <Table.BodyCell>
        {gauge.balToMint === undefined
          ? "Loading..."
          : formatNumber(gauge.balToMint, 4, "decimal", "standard")}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
