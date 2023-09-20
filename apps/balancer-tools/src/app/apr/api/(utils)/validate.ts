import { z } from "zod";

import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";

import { PoolTypeEnum } from "../../(utils)/calculatePoolStats";
import { Order } from "./sort";

const currentDate = new Date();
const minDate = new Date("2020-01-01");

const SUPPORTED_NETWORKS = [""];

const isPositiveOrNull = (value?: number | null) => !value || value >= 0;
const isSupportedNetwork = (value?: string | null) =>
  !value || SUPPORTED_NETWORKS.includes(value);

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
  const validTypes = Object.keys(PoolTypeEnum);
  return types.every((type) => validTypes.includes(type));
};

const OptionalNullableString = z.string().nullable().optional();
const OptionalNullableDate = OptionalNullableString.transform((dateStr) => {
  if (!dateStr) return null;

  const [month, day, year] = dateStr.split("-").map(Number);

  // Check if the parsing was successful and the date is valid
  if (
    !isNaN(month) &&
    !isNaN(day) &&
    !isNaN(year) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    year >= 1900 &&
    year <= new Date().getFullYear()
  ) {
    // Create a Date object in the expected format
    return new Date(
      `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}T00:00:00.000Z`,
    );
  }

  return null; // Invalid date string
});

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
    poolId: OptionalNullableString.refine(
      (poolId) =>
        !poolId ||
        POOLS_WITH_LIVE_GAUGES.some(
          (g) => g.id.toLowerCase() === poolId?.toLowerCase(),
        ),
      { message: "Pool with ID not found" },
    ),
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
