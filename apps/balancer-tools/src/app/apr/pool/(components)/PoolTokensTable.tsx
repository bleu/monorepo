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
  const tokenUrl = (tokenAddress: string) =>
    `${
      networkUrls[poolNetwork as unknown as NetworkChainId].url
    }address/${tokenAddress}`;

  const tokenBalanceUSD = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  return (
    <>
      <Table
        classNames="min-w-full border border-blue6 rounded overflow-auto"
        color="blue"
        shade={"darkWithBorder"}
      >
        <Table.HeaderRow>
          <Table.HeaderCell>Name</Table.HeaderCell>
          {poolTokensStats[0].weight && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4 whitespace-nowrap">
              Weight
            </Table.HeaderCell>
          )}
          {poolTokensStats[0].balance && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4 whitespace-nowrap">
              Balance
            </Table.HeaderCell>
          )}
          {poolTokensStats[0].price && poolTokensStats[0].balance && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4 whitespace-nowrap">
              Value
            </Table.HeaderCell>
          )}
          {poolTokensStats[0].price && poolTokensStats[0].balance && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4 whitespace-nowrap">
              Token %
            </Table.HeaderCell>
          )}
        </Table.HeaderRow>
        <Table.Body>
          {poolTokensStats.map((token) => (
            <Table.BodyRow classNames="hover:bg-blue4 hover:cursor-pointer duration-500">
              <Table.BodyCellLink
                href={tokenUrl(token.address)}
                tdClassNames="w-max sticky left-0 from-blue3 bg-gradient-to-r from-70% sm:bg-transparent"
                linkClassNames="flex gap-2 items-center"
              >
                <div className="w-[25px]">
                  {token.logoSrc && (
                    <Image
                      src={token.logoSrc}
                      height={25}
                      width={25}
                      className="rounded-full"
                      alt={`Logo for ${token.symbol}`}
                    />
                  )}
                </div>
                <div>{token.symbol}</div>
                <div>
                  <ExternalLinkIcon />
                </div>
              </Table.BodyCellLink>
              {token.weight && (
                <Table.BodyCellLink
                  href={tokenUrl(token.address)}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >{`${(token.weight * 100).toFixed()}%`}</Table.BodyCellLink>
              )}
              {token.balance && (
                <Table.BodyCellLink
                  href={tokenUrl(token.address)}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >
                  {String(tokenBalanceUSD(token.balance!)).length <= 3
                    ? token.balance!.toFixed(3)
                    : tokenBalanceUSD(token.balance!)}
                </Table.BodyCellLink>
              )}
              {token.price && token.balance && (
                <Table.BodyCellLink
                  href={tokenUrl(token.address)}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >
                  {`$${tokenBalanceUSD(token.price * token.balance)}`}
                </Table.BodyCellLink>
              )}
              {token.price && token.balance && (
                <Table.BodyCellLink
                  href={tokenUrl(token.address)}
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
