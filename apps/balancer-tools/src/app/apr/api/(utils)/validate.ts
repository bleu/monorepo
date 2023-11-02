import { Network, networksOnBalancer } from "@bleu-fi/utils";
import { parseMMDDYYYYToDate } from "@bleu-fi/utils/date";
import { z } from "zod";

import POOLS_WITHOUT_GAUGES from "#/data/pools-without-gauge.json";
import POOLS_WITH_LIVE_GAUGES from "#/data/voting-gauges.json";

import { PoolTypeEnum } from "../../(utils)/types";
import { Order } from "./sort";

const currentDate = new Date();
const minDate = new Date("2020-01-01");

const isPositiveOrNull = (value?: number | null) => !value || value >= 0;
const isSupportedNetwork = (value?: string | null) =>
  !value ||
  value
    .split(",")
    .some((val) =>
      Object.values(networksOnBalancer).includes(
        val.toLowerCase().trim() as Network,
      ),
    );

const parseFloatOrNull = (str?: string | null) =>
  str ? parseFloat(str) : null;
const splitAndDecode = (str?: string | null) =>
  str ? str.split(",").map(decodeURIComponent) : null;

const isValidTokenSymbol = (_symbols: string[] | null) => {
  return true;
  // if (!symbols) return true;
  // const validSymbols = /* List of valid symbols */;
  // return symbols.every(symbol => validSymbols.includes(symbol.toLowerCase()));
};

const isValidPoolType = (types: string[] | null) => {
  if (!types) return true;
  const validTypes = Object.values(PoolTypeEnum).map((pType) =>
    pType.toLowerCase(),
  );
  return types.every((type) => validTypes.includes(type.toLowerCase()));
};

const OptionalNullableString = z.string().nullable().optional();
const OptionalNullableDate =
  OptionalNullableString.transform(parseMMDDYYYYToDate);

const OptionalNullableFloat = OptionalNullableString.transform(
  parseFloatOrNull,
).refine(isPositiveOrNull, { message: "Value must be positive" });
const OptionalNullableStringArray =
  OptionalNullableString.transform(splitAndDecode);

const DateSchema = OptionalNullableDate.refine(
  (date) =>
    date === null ||
    (!isNaN(date.getTime()) && date >= minDate && date <= currentDate),
  { message: "Invalid date" },
);

export const QueryParamsSchema = z
  .object({
    poolId: OptionalNullableString,
    startAt: DateSchema,
    endAt: DateSchema,
    // TODO: add sort key validation
    sort: OptionalNullableString,
    order: z.nativeEnum(Order).optional(),
    limit: OptionalNullableString.transform(
      (str) => (str && parseInt(str)) || Infinity,
    ),
    offset: OptionalNullableString.transform(
      (str) => (str && parseInt(str)) || 0,
    ),
    network: OptionalNullableString.refine(isSupportedNetwork, {
      message: "Unsupported network",
    }),
    minApr: OptionalNullableFloat,
    maxApr: OptionalNullableFloat,
    minVotingShare: OptionalNullableFloat,
    maxVotingShare: OptionalNullableFloat,
    tokens: OptionalNullableStringArray.refine(isValidTokenSymbol, {
      message: "Invalid token symbol",
    }),
    types: OptionalNullableStringArray.refine(isValidPoolType, {
      message: "Invalid pool type",
    }),
    minTvl: OptionalNullableFloat,
    maxTvl: OptionalNullableFloat,
  })
  .refine((data) => data.poolId || data.startAt || data.endAt, {
    message: "Either poolId, startAt, or endAt must be provided",
  })
  .refine(
    (data) => {
      if (data.startAt && !data.endAt) {
        return false;
      }
      if (data.endAt && !data.startAt) {
        return false;
      }
      return true;
    },
    {
      message: "Both startAt and endAt must be provided together",
    },
  );

export const QueryParamsPagesSchema = z
  .object({
    poolId: OptionalNullableString.refine(
      (poolId) =>
        !poolId ||
        POOLS_WITH_LIVE_GAUGES.some(
          (g) => g.id.toLowerCase() === poolId?.toLowerCase(),
        ) ||
        POOLS_WITHOUT_GAUGES.some(
          (p) => p.id.toLowerCase() === poolId?.toLowerCase(),
        ),
      { message: "Pool with ID not found" },
    ),
    startAt: DateSchema,
    endAt: DateSchema,
  })
  .refine((data) => data.poolId || data.startAt || data.endAt, {
    message: "Either poolId, startAt, or endAt must be provided",
  })
  .refine(
    (data) => {
      if (data.startAt && !data.endAt) {
        return false;
      }
      if (data.endAt && !data.startAt) {
        return false;
      }
      return true;
    },
    {
      message: "Both startAt and endAt must be provided together",
    },
  );
