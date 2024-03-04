import { formatNumber } from "@bleu-fi/utils/formatNumber";

import { ImageFallback } from "#/components/ImageFallback";
import { truncateAddress } from "#/utils/truncate";

export function TokenInfo({
  symbol,
  id,
  amount,
  logoUri,
}: {
  logoUri: string;
  symbol?: string | null;
  id?: string;
  amount?: number | string;
}) {
  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center justify-center">
        <div className="rounded-full">
          <ImageFallback
            src={logoUri}
            fallbackSrc="/assets/generic-token-logo.png"
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
