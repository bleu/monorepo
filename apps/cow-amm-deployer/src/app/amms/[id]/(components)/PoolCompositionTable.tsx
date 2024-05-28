import { formatNumber } from "@bleu/utils/formatNumber";
import { tomatoDark } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import Table from "#/components/Table";
import { TokenInfo } from "#/components/TokenInfo";
import { Tooltip } from "#/components/Tooltip";
import { ICowAmm } from "#/lib/types";

export function PoolCompositionTable({ cowAmm }: { cowAmm: ICowAmm }) {
  const anyTokenWithoutUsdPrice =
    !cowAmm.token0.usdPrice || !cowAmm.token1.usdPrice;
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
            (Number(token.usdValue) * 100) / cowAmm.totalUsdValue;
          return (
            <Table.BodyRow key={token.address}>
              <Table.BodyCell>
                <TokenInfo token={token} />
              </Table.BodyCell>
              <Table.BodyCell>{formatNumber(token.balance, 4)}</Table.BodyCell>
              <Table.BodyCell>
                <div className="flex items-center flex-row gap-2">
                  <>$ {formatNumber(token.usdPrice, 4)} </>
                  {!token.usdPrice && <PriceErrorTooltip />}
                </div>
              </Table.BodyCell>
              <Table.BodyCell>
                <div className="flex items-center flex-row gap-2">
                  <>
                    ${" "}
                    {formatNumber(
                      token.usdValue,
                      2,
                      "decimal",
                      "compact",
                      0.01
                    )}
                  </>
                  {!token.usdPrice && <PriceErrorTooltip />}
                </div>
              </Table.BodyCell>
              <Table.BodyCell>
                <div className="flex items-center flex-row gap-2">
                  <>
                    {anyTokenWithoutUsdPrice ? "-" : formatNumber(valuePct, 2)}{" "}
                    {valuePct && !anyTokenWithoutUsdPrice ? "%" : ""}
                  </>
                  {!token.usdPrice && <PriceErrorTooltip />}
                </div>
              </Table.BodyCell>
            </Table.BodyRow>
          );
        })}
      </Table.Body>
    </Table>
  );
}

function PriceErrorTooltip() {
  return (
    <Tooltip content="Error fetching token USD price">
      <InfoCircledIcon className="size-4" color={tomatoDark.tomato10} />
    </Tooltip>
  );
}
