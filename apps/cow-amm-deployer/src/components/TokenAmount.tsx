import { formatNumber } from "@bleu/utils/formatNumber";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { IToken } from "#/lib/fetchAmmData";

import { Tooltip } from "./Tooltip";

export function TokenAmount({
  token,
  balance,
  usdPrice,
}: {
  token: IToken;
  balance: number;
  usdPrice: number;
}) {
  return (
    <div className="flex flex-col gap-1 justify-end">
      <span>
        {formatNumber(balance, 4)} {token.symbol}
      </span>
      <span className="flex flex-row gap-1 text-sm text-background/50">
        ${formatNumber(balance * usdPrice, 2)}
        {usdPrice ? null : <PriceErrorTooltip />}
      </span>
    </div>
  );
}

function PriceErrorTooltip() {
  return (
    <Tooltip content="Error fetching token USD price">
      <InfoCircledIcon className="size-4 text-destructive" />
    </Tooltip>
  );
}
