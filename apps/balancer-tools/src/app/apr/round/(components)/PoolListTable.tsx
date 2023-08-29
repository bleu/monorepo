"use client";

import { networkFor } from "@bleu-balancer-tools/utils";
import {
  ChevronDownIcon,
  DashIcon,
  InfoCircledIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Tooltip } from "#/components/Tooltip";
import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";

import { PoolStatsData, PoolStatsResults, PoolTokens } from "../../api/route";

export function PoolListTable({
  roundId,
  initialData,
}: {
  roundId: string;
  initialData: PoolStatsResults;
}) {
  const [tableData, setTableData] = useState(initialData.perRound);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortField, setSortField] = useState("apr");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleSorting = (sortField: keyof PoolStatsData, sortOrder: string) => {
    if (sortField) {
      setTableData((prevTableData) => {
        const sortedArray = prevTableData.slice().sort((a, b) => {
          const aValue = a[sortField] as number | string;
          const bValue = b[sortField] as number | string;

          // Handle NaN values
          if (typeof aValue === "number" && isNaN(aValue)) return 1;
          if (typeof bValue === "number" && isNaN(bValue)) return -1;

          if (aValue < bValue) {
            return sortOrder === "asc" ? -1 : 1;
          } else if (aValue > bValue) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        });

        return sortedArray;
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

  const loadMorePools = async () => {
    setIsLoadingMore(true);
    const aditionalPoolsData = await fetcher<PoolStatsResults>(
      `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/apr/api/?roundId=${roundId}&sort=${sortField}&order=${order}&limit=10&offset=${
        Object.keys(tableData).length
      }&minTvl=1000`,
    );
    setTableData((prevTableData) => {
      return prevTableData.concat(aditionalPoolsData.perRound);
    });
    setIsLoadingMore(false);
  };

  return (
    <div className="flex w-full flex-1 justify-center text-white">
      <Table color="blue" shade={"darkWithBorder"}>
        <Table.HeaderRow>
          <Table.HeaderCell>Network</Table.HeaderCell>
          <Table.HeaderCell>Composition</Table.HeaderCell>
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
          {tableData.map((gauge) => (
            <TableRow
              key={gauge.poolId}
              poolId={gauge.poolId}
              network={gauge.network}
              roundId={roundId}
              tokens={gauge.tokens}
              tvl={gauge.tvl}
              votingShare={gauge.votingShare}
              apr={gauge.apr}
            />
          ))}
          <Table.BodyRow>
            <Table.BodyCell colSpan={4}>
              {isLoadingMore ? (
                <Button
                  className="w-full flex content-center justify-center gap-x-3 rounded-t-none rounded-b disabled:cursor-not-allowed"
                  shade="medium"
                  disabled={true}
                >
                  <Spinner size="sm" />
                </Button>
              ) : (
                <Button
                  className="w-full flex content-center justify-center gap-x-3 rounded-t-none rounded-b disabled:cursor-not-allowed"
                  shade="medium"
                  onClick={loadMorePools}
                >
                  Load More <ChevronDownIcon />
                </Button>
              )}
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
  tokens,
  tvl,
  votingShare,
  apr,
}: {
  poolId: string;
  roundId: string;
  network: string;
  tokens: PoolTokens[];
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
      <Table.BodyCellLink href={poolRedirectURL} tdClassNames="w-6">
        <Image
          src={`/assets/network/${networkFor(network)}.svg`}
          height={25}
          width={25}
          alt={`Logo for ${networkFor(network)}`}
        />
      </Table.BodyCellLink>
      <Table.BodyCellLink
        href={poolRedirectURL}
        linkClassNames="gap-2"
        tdClassNames="w-11/12"
      >
        {tokens.map((token) => (
          <div className="relative mx-1 flex max-h-10 items-center rounded-md px-2 py-1 bg-blue6">
            {token.symbol}
            {token.weight ? (
              <span className="text-xs ml-1 text-slate-400">
                {(parseFloat(token.weight) * 100).toFixed(2)}%
              </span>
            ) : (
              ""
            )}
          </div>
        ))}
      </Table.BodyCellLink>

      <Table.BodyCellLink href={poolRedirectURL}>
        {formatNumber(tvl)}
      </Table.BodyCellLink>

      <Table.BodyCellLink href={poolRedirectURL}>
        {formatNumber(votingShare * 100).concat("%")}
      </Table.BodyCellLink>

      <Table.BodyCellLink href={poolRedirectURL}>
        {formatNumber(apr).concat("%")}
      </Table.BodyCellLink>
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
