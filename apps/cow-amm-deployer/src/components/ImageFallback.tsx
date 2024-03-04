import Image from "next/image";
import { useEffect, useState } from "react";

type ImageAttributes = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

type ImageFallbackProps = ImageAttributes & {
  fallbackSrc: string;
  quality?: number;
};

export const ImageFallback = ({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  quality,
}: ImageFallbackProps) => {
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsError(false);
  }, [src]);

  return (
    <Image
      className={className}
      width={Number(width)}
      height={Number(height)}
      quality={quality}
      alt={alt || ""}
      src={isError || !src ? fallbackSrc : src}
      onError={() => setIsError(true)}
    />
  );
};
