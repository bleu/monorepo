// The enum namings should be human-readable and are based on what Balancer shows on their FE
export enum PoolTypeEnum {
  WEIGHTED = "Weighted",
  GYROE = "GyroE",
  STABLE = "Stable",
  META_STABLE = "MetaStable",
  UNKNOWN = "FX",
  COMPOSABLE_STABLE = "ComposableStable",
}

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
