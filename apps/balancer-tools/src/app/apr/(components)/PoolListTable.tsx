"use client";

import { formatNumber } from "@bleu/utils/formatNumber";
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
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "#/components";
import { Badge } from "#/components/Badge";
import { PlotTitle } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Tooltip } from "#/components/Tooltip";
import { TooltipMobile } from "#/components/TooltipMobile";

import {
  APRwithoutBreakdown,
  PoolStats,
  PoolTokens,
} from "../(utils)/fetchDataTypes";
import { formatAPR, formatTVL } from "../(utils)/formatPoolStats";
import { generatePoolPageLink } from "../(utils)/getFilteredUrl";
import { PoolTypeEnum } from "../(utils)/types";
import { MoreFiltersButton } from "./MoreFiltersButton";
import { TokenFilterInput } from "./TokenFilterInput";

export function PoolListTable({
  startAt,
  endAt,
  initialData,
}: {
  startAt: Date;
  endAt: Date;
  initialData: PoolStats[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePools, setHasMorePools] = useState(true);
  const [tableData, setTableData] = useState(initialData);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")));
  const router = useRouter();

  useEffect(() => {
    setTableData(initialData);
    setHasMorePools(!(initialData.length < 10));
    setIsLoadingMore(false);
  }, [initialData]);

  const createQueryString = useCallback(
    (accessor: string) => {
      // @ts-ignore
      const params = new URLSearchParams(searchParams);
      const sortOrder =
        accessor === params.get("sort") && params.get("order") === "desc"
          ? "asc"
          : "desc";
      params.set("order", sortOrder);
      params.set("sort", accessor);
      return params.toString();
    },
    [searchParams]
  );

  const loadMorePools = async () => {
    setIsLoadingMore(true);
    const params = new URLSearchParams(searchParams).toString();
    const regex = /limit=\d+/;
    const newParam = params.replace(regex, `limit=${limit + 10}`);
    setLimit(limit + 10);
    router.push(pathname + "?" + newParam, { scroll: false });
  };

  return (
    <div className="flex flex-col justify-center text-white">
      <PlotTitle
        title={`All Pools`}
        tooltip="All values are the average in the selected date range."
        classNames="py-3"
      />
      <div className="flex text-white mb-5 gap-2">
        <TokenFilterInput />
        <MoreFiltersButton />
      </div>
      <div className="flex justify-center text-white shadow-lg mb-5 overflow-auto scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12">
        <Table color="blue" shade={"darkWithBorder"}>
          <Table.HeaderRow>
            <Table.HeaderCell classNames="p-4">Network</Table.HeaderCell>
            <Table.HeaderCell classNames="w-full p-4">
              Composition
            </Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap p-4">
              Type
            </Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap hover:text-amber9 p-4">
              <div>
                <Link
                  className="flex gap-x-1 items-center float-right justify-end"
                  href={pathname + "?" + createQueryString("tvl")}
                  scroll={false}
                >
                  <span>TVL</span>
                  {OrderIcon(searchParams, "tvl")}
                </Link>
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell classNames="text-end whitespace-nowrap hover:text-amber9 p-4">
              <div className="flex gap-1 space-x-1">
                <Link
                  className="flex gap-x-1 items-center float-right justify-end"
                  href={pathname + "?" + createQueryString("apr")}
                  scroll={false}
                >
                  <span>APR</span>
                  <TooltipMobile content="This considers a veBAL boost of 1. Hence this considers the min veBAL APR.">
                    <InfoCircledIcon />
                  </TooltipMobile>
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
                    tokens={pool.tokens}
                    poolType={pool.type}
                    tvl={pool.tvl}
                    apr={pool.apr}
                    startAt={startAt}
                    endAt={endAt}
                  />
                ))}

                <Table.BodyRow>
                  <Table.BodyCell colSpan={6}>
                    <Button
                      className="py-3 sticky left-0 sm:w-full flex content-center justify-center gap-x-3 rounded-t-none rounded-b disabled:cursor-not-allowed"
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
  network,
  tokens,
  poolType,
  tvl,
  apr,
  startAt,
  endAt,
}: {
  poolId: string | null;
  network: string;
  tokens: PoolTokens[];
  poolType: PoolTypeEnum;
  tvl: number;
  apr: APRwithoutBreakdown;
  startAt: Date;
  endAt: Date;
}) {
  if (!poolId) return null;
  const poolRedirectURL = generatePoolPageLink(startAt, endAt, null, poolId);
  return (
    <Table.BodyRow classNames="sm:hover:bg-blue4 hover:cursor-pointer duration-500">
      <Table.BodyCellLink
        href={poolRedirectURL}
        tdClassNames="flex justify-center items-start sm:items-center h-full w-full"
      >
        <Image
          src={`/assets/network/${network}.svg`}
          height={25}
          width={25}
          alt={`Logo for ${network}`}
        />
      </Table.BodyCellLink>
      <Table.BodyCellLink
        href={poolRedirectURL}
        linkClassNames="gap-2 from-blue3 sm:from-transparent from-50% bg-gradient-to-r sm:bg-transparent flex-col sm:flex-row"
        tdClassNames="w-11/12 sticky left-0"
      >
        {tokens.map((token) => (
          <Badge color="blue" classNames="w-fit" key={token.address}>
            {token.symbol}
            {poolType == PoolTypeEnum.WEIGHTED ? (
              <span className="text-xs ml-1 text-slate-400">
                {(token.weight! * 100).toFixed()}%
              </span>
            ) : (
              ""
            )}
          </Badge>
        ))}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        {poolType}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        {formatTVL(tvl)}
      </Table.BodyCellLink>

      <Table.BodyCellLink linkClassNames="float-right" href={poolRedirectURL}>
        <Tooltip content={<APRHover apr={apr} />}>
          <span>{formatAPR(apr.total)}</span>
        </Tooltip>
      </Table.BodyCellLink>
    </Table.BodyRow>
  );
}

function APRHover({ apr }: { apr: APRwithoutBreakdown }) {
  const aprEntries = Object.entries(apr.breakdown)
    .map(([key, value]) => {
      return [key, value];
    })
    .filter(([, value]) => typeof value !== "object" && value > 0);

  return (
    <ul>
      {aprEntries.map(([key, value]) => (
        <li key={key}>
          <span className="font-semibold text-amber9">{key} APR</span>{" "}
          {formatNumber(value as number, 2)}%
        </li>
      ))}
    </ul>
  );
}

function OrderIcon(
  searchParams: ReadonlyURLSearchParams,
  fieldName: keyof PoolStats
) {
  if (searchParams.get("sort") !== fieldName) return <DashIcon />;

  if (searchParams.get("order") === "asc") {
    return <TriangleUpIcon />;
  } else if (searchParams.get("order") === "desc") {
    return <TriangleDownIcon />;
  }
}
