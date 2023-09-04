"use client";
import { NetworkChainId, networkUrls } from "@bleu-balancer-tools/utils";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import Table from "#/components/Table";

import { PoolTokens } from "../../api/route";

export default function PoolTokensTable({
  poolTokensStats,
  poolNetwork,
}: {
  poolTokensStats: PoolTokens[];
  poolNetwork: string;
}) {
  const tokenUrl = `${networkUrls[poolNetwork as unknown as NetworkChainId].url}address/${poolTokensStats[0].address}`
  const tokenBalanceUSD = (balance: string) =>
    parseFloat(balance).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  return (
    <>
      <Table color="blue" shade={"darkWithBorder"}>
        <Table.HeaderRow>
          <Table.HeaderCell>Name</Table.HeaderCell>
          {poolTokensStats[0].weight && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4">
              Weight
            </Table.HeaderCell>
          )}
          {poolTokensStats[0].balance && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4">
              Balance
            </Table.HeaderCell>
          )}
          {poolTokensStats[0].price && poolTokensStats[0].balance && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4">
              Value
            </Table.HeaderCell>
          )}
          {poolTokensStats[0].price && poolTokensStats[0].balance && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4">
              Token %
            </Table.HeaderCell>
          )}
        </Table.HeaderRow>
        <Table.Body>
          {poolTokensStats.map((token) => (
            <Table.BodyRow classNames="hover:bg-blue4 hover:cursor-pointer duration-500">
              <Table.BodyCellLink
                href={tokenUrl}
                tdClassNames="w-max"
                linkClassNames="flex gap-2 items-center"
              >
                <div className="w-[25px]">
                  <Image
                    src={token.logoSrc}
                    height={25}
                    width={25}
                    className="rounded-full"
                    alt={`Logo for ${token.symbol}`}
                  />
                </div>
                <div>{token.symbol}</div>
                <div>
                  <ExternalLinkIcon />
                </div>
              </Table.BodyCellLink>
              {token.weight && (
                <Table.BodyCellLink
                href={tokenUrl}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >{`${(
                  parseFloat(token.weight) * 100
                ).toFixed()}%`}</Table.BodyCellLink>
              )}
              {poolTokensStats[0].balance && (
                <Table.BodyCellLink
                  href={tokenUrl}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >
                  {String(tokenBalanceUSD(token.balance)).length <= 3
                    ? parseFloat(token.balance).toFixed(3)
                    : tokenBalanceUSD(token.balance)}
                </Table.BodyCellLink>
              )}
              {token.price && poolTokensStats[0].balance && (
                <Table.BodyCellLink
                  href={tokenUrl}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >
                  {`$${(
                    token.price! * parseFloat(token.balance)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`}
                </Table.BodyCellLink>
              )}
              {token.price && poolTokensStats[0].balance && (
                <Table.BodyCellLink
                  href={tokenUrl}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >
                  {`${token.percentageValue!.toFixed(2)}%`}
                </Table.BodyCellLink>
              )}
            </Table.BodyRow>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
