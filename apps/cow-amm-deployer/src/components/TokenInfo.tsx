"use client";
import { formatNumber } from "@bleu/ui";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";

import { TokenLogo } from "#/components/TokenLogo";
import { IToken, ITokenExtended } from "#/lib/fetchAmmData";
import { ChainId } from "#/utils/chainsPublicClients";

import { BlockExplorerLink } from "./ExplorerLink";

export function TokenInfo({
  token,
  showBalance = false,
  showExplorerLink = true,
}: {
  token: IToken | ITokenExtended;
  showBalance?: boolean;
  showExplorerLink?: boolean;
}) {
  const { chainId } = useAccount();
  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-white">
          <TokenLogo
            tokenAddress={token.address}
            chainId={chainId as ChainId}
            className="rounded-full"
            alt="Token Logo"
            height={22}
            width={22}
            quality={100}
          />
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <span>{token.symbol}</span>
        {showExplorerLink && (
          <BlockExplorerLink
            type="token"
            label={<ExternalLinkIcon />}
            identifier={token.address}
            networkId={chainId as ChainId}
          />
        )}
      </div>
      <div>
        {"balance" in token &&
          showBalance &&
          `(${formatNumber(token.balance, 4, "decimal", "compact", 0.001)})`}
      </div>
    </div>
  );
}
