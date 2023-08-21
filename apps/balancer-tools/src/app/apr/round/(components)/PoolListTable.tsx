"use client";

import { ChevronDownIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import votingGauges from "#/data/voting-gauges.json";
import { Pool } from "#/lib/balancer/gauges";

interface PoolStats {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
}

import { networkFor } from "@bleu-balancer-tools/utils";
import { useRouter } from "next/navigation";

import { Button } from "#/components";
import { Tooltip } from "#/components/Tooltip";
import { formatNumber } from "#/utils/formatNumber";

import { calculatePoolStats } from "../../(utils)/calculatePoolStats";

export function PoolListTable({ roundId }: { roundId: string }) {
  return (
    <div className="flex w-full flex-1 justify-center text-white">
      <Table color="blue" shade={"darkWithBorder"}>
        <Table.HeaderRow>
          <Table.HeaderCell>Symbol</Table.HeaderCell>
          <Table.HeaderCell>
            <div className="flex gap-x-1 items-center">
              <span>TVL</span>
              <Tooltip
                content={`This is the TVL calculate at the end of the round`}
              >
                <InfoCircledIcon />
              </Tooltip>
            </div>
          </Table.HeaderCell>
          <Table.HeaderCell>Voting %</Table.HeaderCell>
          <Table.HeaderCell>
            <div className="flex gap-x-1 items-center">
              <span> APR</span>
              <Tooltip
                content={`This is the APR calculate at the end of the round`}
              >
                <InfoCircledIcon />
              </Tooltip>
            </div>
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {votingGauges.slice(0, 10).map((gauge) => (
            <TableRow
              key={gauge.pool.id}
              poolId={gauge.pool.id}
              network={gauge.network}
              roundId={roundId}
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
}: {
  poolId: string;
  roundId: string;
  network: number;
}) {
  const pool = new Pool(poolId);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PoolStats>({} as PoolStats);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await calculatePoolStats({ poolId, roundId });
        setData(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [poolId, roundId]);

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
      <Table.BodyCell>{pool.symbol}</Table.BodyCell>
      {isLoading ? (
        <Table.BodyCell padding="py-4 px-1" colSpan={3}>
          <Spinner size="sm" />
        </Table.BodyCell>
      ) : (
        <>
          <Table.BodyCell padding="py-4 px-1">
            {formatNumber(data.tvl)}
          </Table.BodyCell>
          <Table.BodyCell padding="py-4 px-1">
            {formatNumber(data.votingShare).concat("%")}
          </Table.BodyCell>
          <Table.BodyCell padding="py-4 px-1">
            {formatNumber(data.apr).concat("%")}
          </Table.BodyCell>
        </>
      )}
    </Table.BodyRow>
  );
}
