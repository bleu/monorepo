// The enum namings should be human-readable and are based on what Balancer shows on their FE
export enum PoolTypeEnum {
  WEIGHTED = "Weighted",
  GYROE = "GyroE",
  STABLE = "Stable",
  META_STABLE = "MetaStable",
  UNKNOWN = "FX",
  COMPOSABLE_STABLE = "ComposableStable",
}

export const PoolTypeNames = {
  [PoolTypeEnum.WEIGHTED]: "Weighted",
  [PoolTypeEnum.GYROE]: "GyroE",
  [PoolTypeEnum.STABLE]: "Stable",
  [PoolTypeEnum.META_STABLE]: "MetaStable",
  [PoolTypeEnum.UNKNOWN]: "FX",
  [PoolTypeEnum.COMPOSABLE_STABLE]: "Composable Stable",
};

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
