import { formatNumber } from "@bleu-fi/utils/formatNumber";
import Image from "next/image";

import { cowprotocolTokenLogoUrl } from "#/lib/utils";
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
  const tokenLogoUri =
    id && chainId ? cowprotocolTokenLogoUrl(id, chainId) : "";

  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center justify-center">
        <div className="rounded-full">
          <Image
            src={tokenLogoUri || "/assets/generic-token-logo.png"}
            className="rounded-full"
            alt="Token Logo"
            height={28}
            width={28}
            quality={100}
          />
        </div>
      </div>
      {symbol ? symbol : truncateAddress(id)}{" "}
      {amount && `(${formatNumber(amount, 4, "decimal", "compact", 0.001)})`}
    </div>
  );
}
