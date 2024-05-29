import POOLS_WITHOUT_GAUGES from "@bleu/balancer-apr/src/lib/balancer/data/pools-without-gauge.json";
import POOLS_WITH_LIVE_GAUGES from "@bleu/balancer-apr/src/lib/balancer/data/voting-gauges.json";
import { Network, networksOnBalancer } from "@bleu/utils";
import { parseMMDDYYYYToDate } from "@bleu/utils/date";
import { z } from "zod";

import { PoolTypeNames } from "./types";

const currentDate = new Date();
const minDate = new Date("2020-01-01");

export const areSupportedNetwork = (value?: string | undefined) =>
  value !== undefined &&
  value
    .split(",")
    .every((val) =>
      Object.values(networksOnBalancer).includes(
        val.toLowerCase().trim() as Network,
      ),
    );

export const areSupportedTypes = (value?: string | undefined) =>
  value !== undefined &&
  value.split(",").every((val) => Object.values(PoolTypeNames).includes(val));

const OptionalNullableString = z.string().nullable().optional();
const OptionalNullableDate =
  OptionalNullableString.transform(parseMMDDYYYYToDate);

const DateSchema = OptionalNullableDate.refine(
  (date) =>
    date === null ||
    (!isNaN(date.getTime()) && date >= minDate && date <= currentDate),
  { message: "Invalid date" },
);

export const QueryParamsPagesSchema = z
  .object({
    poolId: OptionalNullableString.refine(
      (poolId) =>
        !poolId ||
        POOLS_WITH_LIVE_GAUGES.some(
          (g) => g.id.toLowerCase() === poolId?.toLowerCase(),
        ) ||
        //@ts-ignore
        POOLS_WITHOUT_GAUGES.some(
          //@ts-ignore
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
