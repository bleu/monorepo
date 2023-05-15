import { ImageResponse } from "next/server";

import { OgImage } from "../ogImage";

export default function og() {
  return new ImageResponse(
    OgImage({
      appName: "Internal Manager",
    }),
    {
      width: 1200,
      height: 630,
    }
  );
}
