import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { formatUnits } from "viem";

import Table from "#/components/Table";
import { ICowAmm } from "#/lib/types";

import { TokenInfo } from "./TokenInfo";

export function PoolCompositionTable({ cowAmm }: { cowAmm: ICowAmm }) {
  return (
    <Table
      color="foreground"
      shade="darkWithBorder"
      classNames="overflow-y-auto text-background"
    >
      <Table.HeaderRow>
        <Table.HeaderCell>Tokens</Table.HeaderCell>
        <Table.HeaderCell>Balance</Table.HeaderCell>
        <Table.HeaderCell>Price</Table.HeaderCell>
        <Table.HeaderCell>Value</Table.HeaderCell>
        <Table.HeaderCell>Weight</Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body>
        {[cowAmm.token0, cowAmm.token1].map((token) => {
          const valuePct =
            (Number(token.fiatBalance) * 100) / cowAmm.totalUsdValue;
          return (
            <Table.BodyRow key={token.tokenInfo.address}>
              <Table.BodyCell>
                <TokenInfo
                  symbol={token.tokenInfo.symbol}
                  id={token.tokenInfo.address}
                  logoUri={token.tokenInfo.logoUri}
                />
              </Table.BodyCell>
              <Table.BodyCell>
                {formatNumber(
                  formatUnits(BigInt(token.balance), token.tokenInfo.decimals),
                  4,
                )}
              </Table.BodyCell>
              <Table.BodyCell>
                $ {formatNumber(token.fiatConversion, 4)}
              </Table.BodyCell>
              <Table.BodyCell>
                ${" "}
                {formatNumber(token.fiatBalance, 2, "decimal", "compact", 0.01)}
              </Table.BodyCell>
              <Table.BodyCell>
                {formatNumber(valuePct, 2)} {valuePct ? "%" : ""}
              </Table.BodyCell>
            </Table.BodyRow>
          );
        })}
      </Table.Body>
    </Table>
  );
}
