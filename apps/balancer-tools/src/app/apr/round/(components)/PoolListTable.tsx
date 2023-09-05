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
import Link from "next/link";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "#/components";
import { Badge } from "#/components/Badge";
import { PlotTitle } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Tooltip } from "#/components/Tooltip";
import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum } from "../../(utils)/calculatePoolStats";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";
import getFilteredRoundApiUrl from "../../(utils)/getFilteredApiUrl";
import { PoolStatsData, PoolStatsResults, PoolTokens } from "../../api/route";
import { MoreFiltersButton } from "./MoreFiltersButton";
import { TokenFilterInput } from "./TokenFilterInput";

export function PoolListTable({
  roundId,
  initialData,
}: {
  roundId: string;
  initialData: PoolStatsData[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tableData, setTableData] = useState(initialData);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePools, setHasMorePools] = useState(true);

  useEffect(() => {
    setTableData(initialData);
    if (tableData.length < 10) {
      setHasMorePools(false);
    }
  }, [initialData]);

  const createQueryString = useCallback(
    (accessor: string) => {
      const params = new URLSearchParams(searchParams);
      const sortOrder =
        accessor === params.get("sort") && params.get("order") === "desc"
          ? "asc"
          : "desc";
      params.set("order", sortOrder);
      params.set("sort", accessor);
      return params.toString();
    },
    [searchParams],
  );

  const loadMorePools = async () => {
    setIsLoadingMore(true);
    const params = Object.fromEntries(searchParams.entries());
    params["offset"] = (tableData.length + 1).toString();
    const aditionalPoolsData = await fetcher<PoolStatsResults>(
      getFilteredRoundApiUrl(params, roundId),
    );
    setTableData((prevTableData) => {
      if (aditionalPoolsData.perRound.length === 0) setHasMorePools(false);
      return prevTableData.concat(aditionalPoolsData.perRound);
    });
    setIsLoadingMore(false);
  };

  return (
    <div className="flex flex-col justify-center text-white">
      <PlotTitle
        title={`All Pools`}
        tooltip="All values are calculated at the end of the round"
        classNames="py-3"
      />
      <div className="flex text-white mb-5 gap-2">
        <TokenFilterInput />
        <MoreFiltersButton />
      </div>
      <div className="flex justify-center text-white shadow-lg mb-5 overflow-auto scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12">
        <Table color="blue" shade={"darkWithBorder"}>
          <Table.HeaderRow>
            <Table.HeaderCell>Network</Table.HeaderCell>
            <Table.HeaderCell classNames="w-full">Composition</Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap">
              Type
            </Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap hover:text-amber9">
              <div>
                <Link
                  className="flex gap-x-1 items-center float-right justify-end"
                  href={pathname + "?" + createQueryString("tvl")}
                >
                  <span>TVL</span>
                  {OrderIcon(searchParams, "tvl")}
                </Link>
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap hover:text-amber9">
              <div>
                <Link
                  className="flex gap-x-1 items-center float-right justify-end"
                  href={pathname + "?" + createQueryString("votingShare")}
                >
                  <span>Voting %</span>
                  {OrderIcon(searchParams, "votingShare")}
                </Link>
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap hover:text-amber9">
              <div>
                <Link
                  className="flex gap-x-1 items-center float-right justify-end"
                  href={pathname + "?" + createQueryString("apr")}
                >
                  <Tooltip content={`The value displayed is the min APR`}>
                    <InfoCircledIcon />
                  </Tooltip>
                  <span> APR</span>
                  {OrderIcon(searchParams, "apr")}
                </Link>
              </div>
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {tableData.length > 0 ? (
              <>
                {tableData.map((pool) => (
                  <TableRow
                    key={pool.poolId}
                    poolId={pool.poolId}
                    network={pool.network}
                    roundId={roundId}
                    tokens={pool.tokens}
                    poolType={pool.type}
                    tvl={pool.tvl}
                    votingShare={pool.votingShare}
                    apr={pool.apr.total}
                  />
                ))}

                <Table.BodyRow>
                  <Table.BodyCell colSpan={6}>
                    <Button
                      className="w-[calc(100vw-2.5rem)] sticky left-0 sm:w-full flex content-center justify-center gap-x-3 rounded-t-none rounded-b disabled:cursor-not-allowed"
                      shade="medium"
                      disabled={isLoadingMore || !hasMorePools}
                      onClick={loadMorePools}
                    >
                      {isLoadingMore ? (
                        <Spinner size="sm" />
                      ) : hasMorePools ? (
                        <>
                          Load More <ChevronDownIcon />
                        </>
                      ) : (
                        <>All pools have been loaded</>
                      )}
                    </Button>
                  </Table.BodyCell>
                </Table.BodyRow>
              </>
            ) : (
              <Table.BodyRow>
                <Table.BodyCell
                  classNames="whitespace-nowrap text-sm text-white py-3 px-5 text-center text-sm font-semibold"
                  colSpan={6}
                >
                  No pools found
                </Table.BodyCell>
              </Table.BodyRow>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

function TableRow({
  poolId,
  roundId,
  network,
  tokens,
  poolType,
  tvl,
  votingShare,
  apr,
}: {
  poolId: string;
  roundId: string;
  network: string;
  tokens: PoolTokens[];
  poolType: keyof typeof PoolTypeEnum;
  tvl: number;
  votingShare: number;
  apr: number;
}) {
  const poolRedirectURL = `/apr/pool/${networkFor(
    network,
  )}/${poolId}/round/${roundId}`;
  return (
    <Table.BodyRow classNames="hover:bg-blue4 hover:cursor-pointer duration-500">
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
        tdClassNames="w-11/12 sticky left-0	opacity-90 sm:opacity-100"
      >
        {tokens.map((token) => (
          <Badge color="blue">
            {token.symbol}
            {token.weight ? (
              <span className="text-xs ml-1 text-slate-400">
                {(parseFloat(token.weight) * 100).toFixed()}%
              </span>
            ) : (
              ""
            )}
          </Badge>
        ))}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        {PoolTypeEnum[poolType]}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        {formatTVL(tvl)}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        {formatNumber(votingShare * 100).concat("%")}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        {formatAPR(apr)}
      </Table.BodyCellLink>
    </Table.BodyRow>
  );
}

function OrderIcon(
  searchParams: ReadonlyURLSearchParams,
  fieldName: keyof PoolStatsData,
) {
  if (searchParams.get("sort") !== fieldName) return <DashIcon />;

  if (searchParams.get("order") === "asc") {
    return <TriangleUpIcon />;
  } else if (searchParams.get("order") === "desc") {
    return <TriangleDownIcon />;
  }
}
