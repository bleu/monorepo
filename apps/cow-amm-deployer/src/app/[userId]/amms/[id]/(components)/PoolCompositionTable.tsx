"use client";

import { formatNumber } from "@bleu/ui";

import Table from "#/components/Table";
import { TokenAmount } from "#/components/TokenAmount";
import { TokenLogo } from "#/components/TokenLogo";
import { ICowAmm } from "#/lib/fetchAmmData";

export function PoolCompositionTable({ ammData }: { ammData: ICowAmm }) {
  const anyTokenWithoutUsdPrice =
    !ammData.token0.usdPrice || !ammData.token1.usdPrice;
  return (
    <Table color="sand">
      <Table.HeaderRow>
        <Table.HeaderCell>
          Balance $({formatNumber(ammData.totalUsdValue, 4)})
        </Table.HeaderCell>
        <Table.HeaderCell>Weight</Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body>
        {[ammData.token0, ammData.token1].map((token) => {
          const valuePct =
            (Number(token.usdValue) * 100) / ammData.totalUsdValue;
          return (
            <Table.BodyRow key={token.address}>
              <Table.BodyCell>
                <div className="flex flex-row gap-2 items-center">
                  <div className="rounded-full bg-white">
                    <TokenLogo
                      tokenAddress={token.address}
                      chainId={ammData.chainId}
                      className="rounded-full"
                      alt={`token-${token.symbol}`}
                      height={30}
                      width={30}
                      quality={100}
                    />
                  </div>
                  <TokenAmount
                    token={token}
                    balance={Number(token.balance)}
                    usdPrice={token.usdPrice}
                  />
                </div>
              </Table.BodyCell>
              <Table.BodyCell>
                <div className="flex items-center flex-row gap-2">
                  <>
                    {anyTokenWithoutUsdPrice ? "-" : formatNumber(valuePct, 2)}{" "}
                    {valuePct && !anyTokenWithoutUsdPrice ? "%" : ""}
                  </>
                </div>
              </Table.BodyCell>
            </Table.BodyRow>
          );
        })}
      </Table.Body>
    </Table>
  );
}
