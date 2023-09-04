"use client";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import Table from "#/components/Table";

import { PoolStatsData } from "../../api/route";

export default function PoolTokensTable({
  poolStats,
}: {
  poolStats: PoolStatsData;
}) {
  return (
    <>
      <Table color="blue" shade={"darkWithBorder"}>
        <Table.HeaderRow>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell classNames="w-1/6 text-end p-4">
            Volume
          </Table.HeaderCell>
          {poolStats.tokens[0].weight && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4">
              Weight
            </Table.HeaderCell>
          )}
          {poolStats.tokens[0].price && (
            <Table.HeaderCell classNames="w-1/6 text-end p-4">
              Value
            </Table.HeaderCell>
          )}
        </Table.HeaderRow>
        <Table.Body>
          {poolStats.tokens.map((token) => (
            <Table.BodyRow classNames="hover:bg-blue4 hover:cursor-pointer duration-500">
              <Table.BodyCellLink
                href={`https://etherscan.io/address/${token.address}`}
                tdClassNames="w-max"
                linkClassNames="flex gap-2 items-center"
              >
                <div className="w-[25px]">
                  <Image
                    src={token.logo}
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
                  href={`https://etherscan.io/address/${token.address}`}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >{`${(
                  parseFloat(token.weight) * 100
                ).toFixed()}%`}</Table.BodyCellLink>
              )}
              <Table.BodyCellLink
                href={`https://etherscan.io/address/${token.address}`}
                tdClassNames="w-6"
                linkClassNames="justify-end w-full"
              >
                {parseFloat(token.balance).toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Table.BodyCellLink>
              {token.price && (
                <Table.BodyCellLink
                  href={`https://etherscan.io/address/${token.address}`}
                  tdClassNames="w-6"
                  linkClassNames="justify-end w-full"
                >
                  {`$${(
                    parseFloat(token.price!) * parseFloat(token.balance)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`}
                </Table.BodyCellLink>
              )}
            </Table.BodyRow>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
