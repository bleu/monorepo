"use client";

import { networkFor } from "@bleu-balancer-tools/utils";
import {
  ChevronDownIcon,
  DashIcon,
  InfoCircledIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import pThrottle from "p-throttle";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Tooltip } from "#/components/Tooltip";
import votingGauges from "#/data/voting-gauges.json";
import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";

interface PoolStats {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
  symbol: string;
}
interface PoolTableData extends PoolStats {
  id: string;
  network: number;
}

export const throttle = pThrottle({
  limit: 3,
  interval: 1500,
});
export function PoolListTable({
  roundId,
  initialData,
}: {
  roundId: string;
  initialData: RoundStatsResults;
}) {
  const [tableData, setTableData] = useState(initialData);
  const [sortField, setSortField] = useState("apr");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleSorting = (sortField: keyof PoolStatsData, sortOrder: string) => {
    if (sortField) {
      setTableData((prevTableData) => {
        const sortedArray = Object.entries(prevTableData).sort(
          ([, a], [, b]) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue !== "number") return 1;
            if (typeof bValue !== "number") return -1;

            if (isNaN(aValue)) return 1;
            if (isNaN(bValue)) return -1;

            if (sortOrder === "asc") {
              return aValue - bValue;
            } else {
              return bValue - aValue;
            }
          },
        );

        const sortedData: RoundStatsResults = {};
        sortedArray.forEach(([key, value]) => {
          sortedData[key] = value;
        });

        return sortedData;
      });
    }
  };

  const handleSortingChange = (accessor: keyof PoolStatsData) => {
    const sortOrder =
      accessor === sortField && order === "desc" ? "asc" : "desc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <div className="flex w-full flex-1 justify-center text-white">
      <Table color="blue" shade={"darkWithBorder"}>
        <Table.HeaderRow>
          <Table.HeaderCell>Symbol</Table.HeaderCell>
          <Table.HeaderCell onClick={() => handleSortingChange("tvl")}>
            <div className="flex gap-x-1 items-center">
              <span>TVL</span>
              <Tooltip
                content={`This is the TVL calculate at the end of the round`}
              >
                <InfoCircledIcon />
              </Tooltip>
              {sortField == "tvl" ? OrderIcon(order) : OrderIcon("neutral")}
            </div>
          </Table.HeaderCell>
          <Table.HeaderCell onClick={() => handleSortingChange("votingShare")}>
            <div className="flex gap-x-1 items-center">
              <span>Voting %</span>
              {sortField == "votingShare"
                ? OrderIcon(order)
                : OrderIcon("neutral")}
            </div>
          </Table.HeaderCell>
          <Table.HeaderCell onClick={() => handleSortingChange("apr")}>
            <div className="flex gap-x-1 items-center">
              <span> APR</span>
              <Tooltip
                content={`This is the APR calculate at the end of the round`}
              >
                <InfoCircledIcon />
              </Tooltip>
              {sortField == "apr" ? OrderIcon(order) : OrderIcon("neutral")}
            </div>
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {Object.entries(tableData).map(([key, gauge]) => (
            <TableRow
              key={key}
              poolId={key}
              network={gauge.network}
              roundId={roundId}
              symbol={gauge.symbol}
              tvl={gauge.tvl}
              votingShare={gauge.votingShare}
              apr={gauge.apr}
            />
          ))}
          <Table.BodyRow>
            <Table.BodyCell colSpan={4}>
              <Button
                className="w-full flex content-center justify-center gap-x-3 rounded-t-none rounded-b disabled:cursor-not-allowed"
                shade="medium"
                disabled={true}
              >
                Load More <ChevronDownIcon />
              </Button>
            </Table.BodyCell>
          </Table.BodyRow>
        </Table.Body>
      </Table>
    </div>
  );
}

function TableRow({
  poolId,
  roundId,
  network,
  symbol,
  tvl,
  votingShare,
  apr,
}: {
  poolId: string;
  roundId: string;
  network: string;
  symbol: string;
  tvl: number;
  votingShare: number;
  apr: number;
}) {
  const poolRedirectURL = `/apr/pool/${networkFor(
    network,
  )}/${poolId}/round/${roundId}`;
  const router = useRouter();
  return (
    <Table.BodyRow
      classNames="hover:bg-blue4 hover:cursor-pointer"
      onClick={() => {
        router.push(poolRedirectURL);
      }}
    >
      <Table.BodyCell>
        {symbol} ({networkFor(network)})
      </Table.BodyCell>
      <Table.BodyCell padding="py-4 px-1">{formatNumber(tvl)}</Table.BodyCell>
      <Table.BodyCell padding="py-4 px-1">
        {formatNumber(votingShare).concat("%")}
      </Table.BodyCell>
      <Table.BodyCell padding="py-4 px-1">
        {formatNumber(apr).concat("%")}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

function OrderIcon(order: "asc" | "desc" | "neutral") {
  if (order === "asc") {
    return <TriangleUpIcon />;
  } else if (order === "desc") {
    return <TriangleDownIcon />;
  } else {
    return <DashIcon />;
  }
}
