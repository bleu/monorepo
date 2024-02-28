import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import Image from "next/image";

import { cowTokenList } from "#/utils/cowTokenList";
import { truncateAddress } from "#/utils/truncate";

export function TokenInfo({
  symbol,
  id,
  amount,
}: {
  symbol?: string | null;
  id?: string;
  amount?: number | string;
}) {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();
  const tokenLogoUri = cowTokenList.find(
    (token) => token.address === id && token.chainId === chainId,
  )?.logoURI;
  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-white p-1">
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
