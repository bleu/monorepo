import { IToken } from "#/lib/fetchAmmData";
import { ChainId } from "#/utils/chainsPublicClients";

import { TokenLogo } from "./TokenLogo";

export function TokenPairLogo({
  token0,
  token1,
  chainId,
}: {
  token0: IToken;
  token1: IToken;
  chainId: ChainId;
}) {
  return (
    <div className="relative flex h-full">
      <div className="rounded-full bg-white inset-0 object-cover z-0">
        <TokenLogo
          tokenAddress={token0.address}
          chainId={chainId}
          className="rounded-full"
          alt={`token-${token1.address}`}
          height={50}
          width={50}
          quality={100}
        />
      </div>
      <div className="rounded-full bg-white inset-0 object-cover z-10 -translate-x-3">
        <TokenLogo
          tokenAddress={token1.address}
          chainId={chainId}
          className="rounded-full"
          alt={`token-${token1.symbol}`}
          height={50}
          width={50}
          quality={100}
        />
      </div>
    </div>
  );
}
