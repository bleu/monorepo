import { formatNumber } from "@bleu/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

import { TokenLogo } from "#/components/TokenLogo";
import { ChainId } from "#/utils/chainsPublicClients";
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
  const { safe } = useSafeAppsSDK();
  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center justify-center">
        <div className="rounded-full">
          <TokenLogo
            src={logoUri}
            tokenAddress={id}
            chainId={safe.chainId as ChainId}
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
