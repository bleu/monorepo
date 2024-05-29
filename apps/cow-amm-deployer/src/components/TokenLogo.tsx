import Image from "next/image";
import { useEffect, useState } from "react";
import { gnosis, mainnet, sepolia } from "viem/chains";

import { cowTokenList } from "#/lib/cowTokenList";
import { ChainId } from "#/utils/chainsPublicClients";

type ImageAttributes = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

type ImageFallbackProps = Omit<ImageAttributes, "src"> & {
  tokenAddress?: string;
  chainId?: ChainId;
  quality?: number;
};

const tokenUrlRoot =
  "https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/images";

export const cowprotocolTokenLogoUrl = (address?: string, chainId?: ChainId) =>
  `${tokenUrlRoot}/${chainId}/${address?.toLowerCase()}/logo.png`;

export const cowTokenListLogoUrl = (address?: string, chainId?: ChainId) => {
  return cowTokenList.find(
    (token) =>
      token.chainId === chainId &&
      token.address.toLowerCase() === address?.toLowerCase()
  )?.logoURI;
};

const chainIdToName: Record<ChainId, string> = {
  [mainnet.id]: "ethereum",
  [gnosis.id]: "xdai",
  [sepolia.id]: "ethereum",
};

export function trustTokenLogoUrl(address?: string, chainId?: ChainId): string {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainIdToName[chainId || 1]}/assets/${address}/logo.png`;
}

const FALLBACK_SRC = "/assets/generic-token-logo.png";
export const TokenLogo = ({
  tokenAddress,
  chainId,
  alt,
  width,
  height,
  className,
  quality,
}: ImageFallbackProps) => {
  const imagesSrc = [
    cowprotocolTokenLogoUrl(tokenAddress, chainId),
    cowprotocolTokenLogoUrl(tokenAddress, 1),
    cowTokenListLogoUrl(tokenAddress, chainId),
    cowTokenListLogoUrl(tokenAddress, 1),
    trustTokenLogoUrl(tokenAddress, chainId),
    trustTokenLogoUrl(tokenAddress, 1),
    FALLBACK_SRC,
  ] as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [tokenAddress, chainId]);

  return (
    <Image
      className={className}
      width={Number(width)}
      height={Number(height)}
      quality={quality}
      alt={alt || ""}
      src={imagesSrc[index]}
      onError={() => {
        setIndex(index + 1);
      }}
    />
  );
};
