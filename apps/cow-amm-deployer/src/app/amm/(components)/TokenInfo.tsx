import { formatNumber } from "@bleu-fi/utils/formatNumber";

import { cowTokenList } from "#/utils/cowTokenList";
import { truncateAddress } from "#/utils/truncate";

export function TokenInfo({
  symbol,
  id,
  chainId,
  amount,
}: {
  symbol?: string | null;
  id?: string;
  chainId?: number;
  amount?: number | string;
}) {
  const tokenLogoUri = cowTokenList.find(
    (token) =>
      token.address.toLowerCase() === id?.toLowerCase() &&
      token.chainId === chainId,
  )?.logoURI;
  return (
    <div className="flex items-center gap-x-1">
      <div className="w-12">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white p-1">
            <img
              src={tokenLogoUri || "/assets/generic-token-logo.png"}
              className="rounded-full"
              alt="Token Logo"
              height={28}
              width={28}
            />
          </div>
        </div>
      </div>
      {symbol ? symbol : truncateAddress(id)}{" "}
      {amount && `(${formatNumber(amount, 4, "decimal", "compact", 0.001)})`}
    </div>
  );
}
