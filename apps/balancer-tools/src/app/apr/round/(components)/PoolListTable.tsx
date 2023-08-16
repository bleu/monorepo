import { networkFor } from "@bleu-balancer-tools/utils";
import Link from "next/link";
import { Suspense } from "react";

import Table from "#/components/TableServerSide";
import votingGauges from "#/data/voting-gauges.json";
import { Pool } from "#/lib/balancer/gauges";
import { formatNumber } from "#/utils/formatNumber";

import BalancerAPI from "../../(utils)/balancerAPI";
import calculateRoundAPR from "../../(utils)/calculateRoundAPR";
import { getBALPriceByRound } from "../../(utils)/getBALPriceByRound";
import { getPoolRelativeWeight } from "../../(utils)/getRelativeWeight";
import { Round } from "../../(utils)/rounds";

export default async function PoolListTable({ roundId }: { roundId: string }) {
  return (
    <div className="overflow-hidden rounded-lg w-full text-white">
      <Table
        wrapperClassNames="overflow-y-auto"
        tableClassNames="bg-transparent"
        defaultStyles={false}
      >
        <Table.HeaderRow classNames="[&>:first-child]:pl-8 [&>:last-child]:pr-8">
          <Table.HeaderCell padding="py-4 px-1">Name</Table.HeaderCell>
          <Table.HeaderCell padding="py-4 px-1">TVL</Table.HeaderCell>
          <Table.HeaderCell padding="py-4 px-1"> Votes % </Table.HeaderCell>
          <Table.HeaderCell padding="py-4 px-1">APR</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body classNames="bg-white">
          {votingGauges.slice(0, 10).map((gauge) => (
            <TableRow
              poolId={gauge.pool.id}
              network={gauge.network}
              roundId={roundId}
              key={gauge.address}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export async function PoolVotes({
  roundId,
  pool,
}: {
  roundId?: string;
  pool: Pool;
}) {
  if (!roundId) return null;

  const votingShare = await getPoolRelativeWeight(
    pool.id,
    Round.getRoundByNumber(roundId).endDate.getTime() / 1000,
  );

  return <>{(votingShare * 100).toFixed(2)}%</>;
}

export async function PoolTVL({ pool }: { pool: Pool }) {
  const TotalValueLocked = await BalancerAPI.getPoolTotalLiquidityUSD(
    pool.gauge?.network || 1,
    pool.id,
  );
  return <>{formatNumber(TotalValueLocked)}</>;
}

export async function PoolAPR({
  roundId,
  pool,
}: {
  roundId?: string;
  pool: Pool;
}) {
  // TODO: aggregate historical pool APR when roundId is not provided
  if (!roundId) return null;

  const round = Round.getRoundByNumber(roundId);
  const [balPriceUSD, tvl, votingShare] = await Promise.all([
    getBALPriceByRound(round),
    // TODO: must select the correct network
    BalancerAPI.getPoolTotalLiquidityUSD(pool.gauge?.network || 1, pool.id),
    getPoolRelativeWeight(pool.id, round.endDate.getTime() / 1000),
  ]);

  const apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100;

  return <>{apr?.toFixed?.(2)}%</>;
}

function TableRow({
  network,
  poolId,
  roundId,
}: {
  poolId: string;
  network?: number;
  roundId?: string;
}) {
  const pool = new Pool(poolId);
  const poolRedirectURL = roundId
    ? `/apr/pool/${networkFor(network)}/${poolId}/round/${roundId}`
    : `/apr/pool/${networkFor(network)}/${poolId}`;

  return (
    <Table.BodyRow key={pool.id}>
      <Table.BodyCell>
        <Link className="py-4 px-1" href={poolRedirectURL}>
          {pool.id}
        </Link>
      </Table.BodyCell>
      <Table.BodyCell padding="py-4 px-1">
        <Suspense fallback={<TableLoadingIcon />}>
          <PoolTVL pool={pool} />
        </Suspense>
      </Table.BodyCell>
      <Table.BodyCell padding="py-4 px-1">
        <Suspense fallback={<TableLoadingIcon />}>
          <PoolAPR roundId={roundId} pool={pool} />
        </Suspense>
      </Table.BodyCell>
      <Table.BodyCell padding="py-4 px-1">
        <Suspense fallback={<TableLoadingIcon />}>
          <PoolVotes roundId={roundId} pool={pool} />
        </Suspense>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

function TableLoadingIcon() {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className="inline w-4 h-4 mr-3 text-white animate-spin"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#E5E7EB"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  );
}
