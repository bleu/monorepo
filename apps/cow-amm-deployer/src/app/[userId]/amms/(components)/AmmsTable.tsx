"use client";

import { formatNumber } from "@bleu/ui";
import { useRouter } from "next/navigation";

import Table from "#/components/Table";
import { TokenInfo } from "#/components/TokenInfo";
import { ICoWAmmOverview } from "#/lib/fetchAmmData";

export function AmmsTable({
  standaloneAmmData,
  userId,
}: {
  standaloneAmmData: ICoWAmmOverview[];
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
        <Table.HeaderCell>
          <span className="sr-only">Token pair</span>
        </Table.HeaderCell>
        <Table.HeaderCell>Value</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Updated at</Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body>
        {standaloneAmmData.length === 0 ? (
          <Table.BodyRow>
            <Table.BodyCell colSpan={5} classNames="text-center" padding="py-2">
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
              classNames="hover:cursor-pointer hover:bg-foreground/50"
            >
              <Table.BodyCell padding="px-1">
                <span className="text-base">
                  <TokenInfo token={amm.token0} />
                </span>
              </Table.BodyCell>
              <Table.BodyCell padding="px-1">
                <span className="text-base">
                  <TokenInfo token={amm.token1} />
                </span>
              </Table.BodyCell>
              <Table.BodyCell>
                <span className="text-base">
                  $ {formatNumber(amm.totalUsdValue, 2)}
                </span>
              </Table.BodyCell>
              <Table.BodyCell>
                {amm.disabled ? (
                  <span className="bg-highlight rounded-full p-2 text-base">
                    Paused
                  </span>
                ) : (
                  <span className="bg-success rounded-full p-2 text-base">
                    Active
                  </span>
                )}
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
