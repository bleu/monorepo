import { dateToEpoch, SECONDS_IN_YEAR } from "@bleu/utils/date";

const INITIAL_RATE = 145000;
const START_EPOCH_TIME = 1648465251;
const RATE_REDUCTION_TIME = SECONDS_IN_YEAR;
const RATE_REDUCTION_COEFFICIENT = 2 ** (1 / 4);

export const weekly = (
  currentTimestamp: number = dateToEpoch(new Date())
): number => {
  const miningEpoch = Math.floor(
    (currentTimestamp - START_EPOCH_TIME) / RATE_REDUCTION_TIME
  );
  return INITIAL_RATE * RATE_REDUCTION_COEFFICIENT ** -miningEpoch;
};

export const total = (epoch: number): number =>
  (INITIAL_RATE * RATE_REDUCTION_COEFFICIENT ** -epoch * 365) / 7;

const totalForEpoch = (epoch: number) =>
  (total(epoch) * RATE_REDUCTION_TIME) / SECONDS_IN_YEAR;

export const between = (start: number, end: number): number => {
  if (start < START_EPOCH_TIME)
    throw "start timestamp before emission schedule deployment";
  if (end < start) throw "cannot finish before starting";

  const startingEpoch = Math.floor(
    (start - START_EPOCH_TIME) / RATE_REDUCTION_TIME
  );
  const endingEpoch = Math.floor(
    (end - START_EPOCH_TIME) / RATE_REDUCTION_TIME
  );

  let totalEmissions = 0;
  for (
    let currentEpoch = startingEpoch;
    currentEpoch <= endingEpoch;
    currentEpoch++
  ) {
    totalEmissions += totalForEpoch(currentEpoch);
  }

  totalEmissions -=
    (totalForEpoch(startingEpoch) *
      (START_EPOCH_TIME + RATE_REDUCTION_TIME * (startingEpoch + 1) - start)) /
    RATE_REDUCTION_TIME;
  totalEmissions -=
    (totalForEpoch(endingEpoch) *
      (START_EPOCH_TIME + RATE_REDUCTION_TIME * endingEpoch - end)) /
    RATE_REDUCTION_TIME;

  return totalEmissions;
};
