import { ImageResponse } from "next/server";

import { OgImage } from "../../components/ogImage";

export default function og() {
  return new ImageResponse(
    OgImage({
      appName: "StableSwapSimulator",
    }),
    {
      width: 1200,
      height: 630,
    }
  );
}
