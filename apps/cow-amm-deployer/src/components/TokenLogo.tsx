import Image from "next/image";
import { useEffect, useState } from "react";

import { ChainId } from "#/utils/chainsPublicClients";

type ImageAttributes = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

type ImageFallbackProps = ImageAttributes & {
  tokenAddress?: string;
  chainId?: ChainId;
  quality?: number;
};

const tokenUrlRoot =
  "https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/images";

export const cowprotocolTokenLogoUrl = (
  address?: string,
  chainId?: ChainId,
) => {
  if (!address || !chainId) return;
  return `${tokenUrlRoot}/${chainId}/${address.toLowerCase()}/logo.png`;
};

const FALLBACK_SRC = "/assets/generic-token-logo.png";
export const TokenLogo = ({
  src,
  tokenAddress,
  chainId,
  alt,
  width,
  height,
  className,
  quality,
}: ImageFallbackProps) => {
  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    if (src) setImageSrc(src);
  }, [src]);

  return (
    <Image
      className={className}
      width={Number(width)}
      height={Number(height)}
      quality={quality}
      alt={alt || ""}
      src={imageSrc || FALLBACK_SRC}
      onError={() => {
        if (imageSrc === src)
          setImageSrc(
            cowprotocolTokenLogoUrl(tokenAddress, chainId) || FALLBACK_SRC,
          );
        else setImageSrc(FALLBACK_SRC);
      }}
    />
  );
};
