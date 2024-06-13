"use client";

import { formatNumber } from "@bleu/ui";
import { useRouter } from "next/navigation";

import { StatusBadge } from "#/components/StatusBadge";
import Table from "#/components/Table";
import { TokenInfo } from "#/components/TokenInfo";
import { ICowAmm } from "#/lib/fetchAmmData";

export function AmmsTable({
  standaloneAmmData,
  userId,
}: {
  standaloneAmmData: ICowAmm[];
  userId: string;
}) {
  const router = useRouter();

  return (
    <Table
      color="foreground"
      shade="darkWithBorder"
      classNames="overflow-y-auto text-background"
    >
      <Table.HeaderRow>
        <Table.HeaderCell>Token pair</Table.HeaderCell>
        <Table.HeaderCell classNames="sr-only">Token Pair</Table.HeaderCell>
        <Table.HeaderCell>Value</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Updated at</Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body>
        {standaloneAmmData.length === 0 ? (
          <Table.BodyRow>
            <Table.BodyCell colSpan={5} classNames="text-center">
              <span className="text-base">No AMMs created yet</span>
            </Table.BodyCell>
          </Table.BodyRow>
        ) : (
          standaloneAmmData.map((amm) => (
            <Table.BodyRow
              key={amm.id}
              onClick={() => {
                router.push(`/${userId}/amms/${amm.id}`);
              }}
              classNames="hover:cursor-pointer hover:bg-accent"
            >
              <Table.BodyCell>
                <TokenInfo
                  token={amm.token0}
                  showBalance={true}
                  showExplorerLink={false}
                />
              </Table.BodyCell>
              <Table.BodyCell>
                <TokenInfo
                  token={amm.token1}
                  showBalance={true}
                  showExplorerLink={false}
                />
              </Table.BodyCell>
              <Table.BodyCell>
                <span className="text-base">
                  $ {formatNumber(amm.totalUsdValue, 2)}
                </span>
              </Table.BodyCell>
              <Table.BodyCell>
                <StatusBadge disabled={amm.disabled} />
              </Table.BodyCell>
              <Table.BodyCell>
                <span className="text-base">
                  {new Date(
                    (amm.order.blockTimestamp as number) * 1000
                  ).toLocaleString()}
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          ))
        )}
      </Table.Body>
    </Table>
  );
}
