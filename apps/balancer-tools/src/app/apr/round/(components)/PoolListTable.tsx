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
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Tooltip } from "#/components/Tooltip";
import { formatNumber } from "#/utils/formatNumber";

import { calculatePoolStats } from "../../(utils)/calculatePoolStats";
import { getPoolList } from "../../(utils)/getPoolList";

interface PoolStats {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
}
interface PoolTableData extends PoolStats {
  id: string;
  network: number;
  symbol: string;
}

export function PoolListTable({ roundId }: { roundId: string }) {
  const [isLoadingFetchPoolList, setIsLoadingFetchPoolList] = useState(true);
  const [tableData, setTableData] = useState([] as PoolTableData[]);
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poolList = await getPoolList();

        //maybe round can be passed to getPoolList and calculatePoolStats can be done there
        const poolListWithStats = await Promise.all(
          poolList.map(async (pool) => {
            const poolStats = await calculatePoolStats({
              roundId,
              poolId: pool.id,
            });

            return {
              id: pool.id,
              network: Number(pool.networkId),
              symbol: pool.symbol as string,
              ...poolStats,
            };
          })
        );

        setTableData(poolListWithStats);

        setIsLoadingFetchPoolList(false);
      } catch (error) {
        setIsLoadingFetchPoolList(false);
      }
    };

    fetchData();
  }, [roundId]);

  const handleSorting = (sortField: keyof PoolTableData, sortOrder: string) => {
    if (sortField) {
      setTableData((prevTableData) => {
        const sortedArray = prevTableData.slice().sort((a, b) => {
          const aValue = a[sortField] as number;
          const bValue = b[sortField] as number;

          if (isNaN(aValue)) return 1;
          if (isNaN(bValue)) return -1;

          if (sortOrder === "asc") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });

        return sortedArray;
      });
    }
  };

  const handleSortingChange = (accessor: keyof PoolTableData) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
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
          {isLoadingFetchPoolList ? (
            <Table.BodyRow>
              <Table.BodyCell colSpan={4}>
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </Table.BodyCell>
            </Table.BodyRow>
          ) : (
            tableData.map((gauge) => (
              <TableRow
                tableData={tableData}
                setTableData={setTableData}
                key={gauge.id}
                poolId={gauge.id}
                network={gauge.network}
                roundId={roundId}
              />
            ))
          )}
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
  tableData,
  setTableData,
}: {
  poolId: string;
  roundId: string;
  network: number;
  tableData: PoolTableData[];
  setTableData: Dispatch<SetStateAction<PoolTableData[]>>;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await calculatePoolStats({ poolId, roundId });
        setTableData((prevTableData) => {
          const updatedTableData = prevTableData.map((pool) => {
            if (pool.id === poolId) {
              return {
                ...pool,
                ...result,
              };
            }
            return pool;
          });
          return updatedTableData;
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [poolId, roundId]);

  const selectedPoolData: PoolTableData | undefined = tableData.find(
    (data) => data.id === poolId
  );
  const poolRedirectURL = `/apr/pool/${networkFor(
    network
  )}/${poolId}/round/${roundId}`;
  const router = useRouter();
  return (
    <Table.BodyRow
      classNames="hover:bg-blue4 hover:cursor-pointer"
      onClick={() => {
        router.push(poolRedirectURL);
      }}
    >
      <Table.BodyCell>{selectedPoolData?.symbol}</Table.BodyCell>
      {isLoading ? (
        <Table.BodyCell padding="py-4 px-1" colSpan={3}>
          <Spinner size="sm" />
        </Table.BodyCell>
      ) : (
        <>
          <Table.BodyCell padding="py-4 px-1">
            {formatNumber(selectedPoolData?.tvl || NaN)}
          </Table.BodyCell>
          <Table.BodyCell padding="py-4 px-1">
            {formatNumber(selectedPoolData?.votingShare || NaN).concat("%")}
          </Table.BodyCell>
          <Table.BodyCell padding="py-4 px-1">
            {formatNumber(selectedPoolData?.apr || NaN).concat("%")}
          </Table.BodyCell>
        </>
      )}
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
